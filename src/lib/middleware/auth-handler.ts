import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";
import env from "@/env";
const JWT = require("jsonwebtoken");

// type
export type CustomRequest = Request & { user: { uid: string; role: string } };

function AuthHandler({ userRole = "user" }: { userRole?: "admin" | "user" }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if token exist
      const token = req.headers.authorization?.split(" ")[1]; // Bearer ${token}
      if (!token) {
        throw new CustomError(
          HttpRes.status.UNAUTHORIZED,
          HttpRes.message.UNAUTHORIZED,
          HttpRes.details.UNAUTHORIZED,
        );
      }

      // check auth base on user role
      const { uid, role } = JWT.verify(token, env.JWT_SECRET);
      if (userRole === "admin" && role !== "admin") {
        throw new CustomError(
          HttpRes.status.FORBIDDEN,
          HttpRes.message.FORBIDDEN,
          HttpRes.details.FORBIDDEN,
        );
      }

      // modified req object - cast to CustomRequest to add user property
      (req as CustomRequest).user = { uid, role };

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const authUser = AuthHandler({ userRole: "user" });
export const authAdmin = AuthHandler({ userRole: "admin" });
