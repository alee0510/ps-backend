import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import redis from "@/lib/redis";
import { Session, sign, unsign } from "@/lib/utils";
import env from "@/env";
const cookie = require("cookie");

// @types
declare module "express-serve-static-core" {
  interface Request {
    session?: Session | null;
    sessionID?: string | null;
  }
}

// @flow
// not auth -> access resource -> req.session = {} -> res no cookies & no session on Redis;
// not auth -> do auth -> req.session.replace({ uid, role}) -> req.session.isDirty() -> set cookies & save session to Redis;
// auth -> access resource -> req.session = new Session({ uid, role}) -> req has cookies & save session to Redis if dirty / rolling;
// auth -> logout -> req.session.destroy() -> clear cookies & remove session from Redis;

// @middleware
export const createSession = (options: {
  name?: string;
  secret?: string;
  ttl?: number; // time to live in seconds
  rolling?: boolean; // refresh expiry on every request
  seveUninitialized?: boolean; // save session even if it's not modified or empty {}
}) => {
  const {
    name = "sid",
    secret,
    ttl = 60 * 60 * 24,
    rolling = false,
    seveUninitialized = false,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @parse the Cookie
      const cookies = cookie.parse(req.headers.cookie || "");
      let sessionID: string | null = null;
      let sessionData: Record<string, any> = {};

      // @check if session exist in Redis and load it
      if (cookies[name]) {
        const unsignedSessionID = unsign(cookies[name], secret as string);
        if (unsignedSessionID) {
          sessionID = unsignedSessionID;
          const rawData = await redis.get(`session:${sessionID}`);
          if (rawData) {
            sessionData = JSON.parse(rawData);
          }
        }
      }

      // @generate new session id if not exist
      if (!sessionID) {
        sessionID = crypto.randomUUID();
      }

      // @attach session to request
      req.sessionID = sessionID;
      req.session = new Session(sessionData);

      // @hook into "finish" event to save session
      res.on("finish", async () => {
        console.log("FINISH");
        console.log("SESSION", req.session);
        console.log("SESSION ID", req.sessionID);
        // check if session exist on request, by default its always empty object
        if (!req.session) return;
        if (req.session && req.session.isEmpty() && !seveUninitialized) {
          return;
        }

        // @destroyed
        if (req.session.isDestroyed()) {
          await redis.del(`session:${sessionID}`);
          return;
        }

        // @rolling
        if (rolling || req.session.isTouched()) {
          await redis.expire(`session:${sessionID}`, ttl);
        }

        // @if dirty -> user modified the session
        if (req.session.isDirty()) {
          // @save session to Redis
          const key = `session:${sessionID}`;
          await redis.set(key, JSON.stringify(req.session), "EX", ttl);
        }
      });

      // @override res.end to set cookie before response is sent
      const originalEnd = res.end.bind(res);
      res.end = function (chunk?: any, encoding?: any, cb?: any): Response {
        console.log("END");
        // @set cookie before ending response
        if (
          req.session &&
          (req.session.isDirty() ||
            req.session.isTouched() ||
            rolling)
        ) {
          console.log("SET COOKIE");
          const signed = sign(sessionID as string, secret as string);
          res.setHeader(
            "Set-Cookie",
            cookie.serialize(name, signed, {
              httpOnly: true,
              maxAge: ttl,
              sameSite: "lax", // csrf (cross-site request forgery) protection
              secure: env.NODE_ENV === "production", // https only
              path: "/",
            }),
          );
        }

        // @call original end method
        return originalEnd(chunk, encoding, cb);
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
