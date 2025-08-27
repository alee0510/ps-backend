import crypto from "crypto";
import {
  hashPassword,
  generateSalt,
  verifyPassword,
  generateToken,
  verifyToken,
  createHandler,
  transporter,
} from "@/lib/utils";
import { CustomRequest } from "@/lib/middleware";
import {
  RegisterSchema,
  LoginSchema,
  SendVerificationEmailSchema,
} from "./auth.validation";
import * as AuthService from "./auth.service"; // eslint-disable-line
import redis from "@/lib/redis";
import { Http } from "winston/lib/winston/transports";

export const Register = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // validate request body
    const { username, email, password } = await RegisterSchema.validate(
      req.body,
      { abortEarly: false },
    );

    // check if user already exists
    const user = await AuthService.searchUser({ email, username });
    if (user) {
      throw new CustomError(
        HttpRes.status.BAD_REQUEST,
        HttpRes.message.BAD_REQUEST,
        HttpRes.details.BAD_REQUEST + ": User already exists",
      );
    }

    // hash password
    const salt = generateSalt();
    const hashedPassworrd = await hashPassword(password, salt);

    // create new user into db
    const newUser = await AuthService.createUser({
      username,
      email,
      salt,
      password: hashedPassworrd,
    });

    // create user profile
    await AuthService.createUserProfile(newUser.uid);

    // send verification email

    res
      .status(HttpRes.status.CREATED)
      .json(ResponseHandler.success(HttpRes.message.CREATED, newUser));
  },
);

export const Login = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes, Logger }) => {
    // do input validation
    const { password } = await LoginSchema.validate(req.body, {
      abortEarly: false,
    });

    // check if user exists
    const user = await AuthService.searchUser({ email: req.body.email });
    if (!user) {
      throw new CustomError(
        HttpRes.status.NOT_FOUND,
        HttpRes.message.NOT_FOUND,
        HttpRes.details.NOT_FOUND + ": User not found",
      );
    }

    // do authentication
    const isValid = await verifyPassword(password, user.salt, user.password);
    if (!isValid) {
      throw new CustomError(
        HttpRes.status.UNAUTHORIZED,
        HttpRes.message.UNAUTHORIZED,
        HttpRes.details.UNAUTHORIZED + ": Invalid credentials",
      );
    }

    // do session management -> { key : value } -> { sessionId : { userId, role }}
    const sessionId = crypto.randomBytes(512).toString("hex").normalize();
    Logger.info(sessionId, { sessionId: { uid: user.uid, role: user.role } });

    // save session id to db (REDIS)
    await redis.set(
      sessionId,
      JSON.stringify({ uid: user.uid, role: user.role }),
      "EX",
      60 * 60 * 24, // seconds
    );

    // return response
    res
      .header("Authorization", `Bearer ${sessionId}`)
      .status(HttpRes.status.OK)
      .json(
        ResponseHandler.success(HttpRes.message.OK, {
          uid: user.uid,
          username: user.username,
          email: user.email,
          role: user.role,
          verified: user.verified,
          active: user.active,
        }),
      );
  },
);

export const SendVerificationEmail = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // input validation
    const { email } = await SendVerificationEmailSchema.validate(req.body, {
      abortEarly: false,
    });

    // generate verification token
    const token = generateToken(
      {
        email,
        uid: (req as CustomRequest).user.uid,
      },
      { expiresIn: "1m" },
    );

    // send email
    transporter.sendMail({
      from: "Admin <sender@gmail.com>",
      to: email,
      subject: "Test Drive from Express App",
      template: "email/verify-email",
      context: {
        subject: "Verify your email",
        appName: "TokoTok",
        userName: "Ali",
        verifyUrl: `http://localhost:2000/api/auth/verify-email?token=${token}`,
        expiresIn: "24 hours",
        supportEmail: "support@example.com",
        year: new Date().getFullYear(),
      },
    });

    res
      .status(HttpRes.status.OK)
      .json(ResponseHandler.success(HttpRes.message.NO_CONTENT, null));
  },
);

export const VerifyEmail = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // get token from query params
    const { token } = req.query;
    if (!token) {
      throw new CustomError(
        HttpRes.status.BAD_REQUEST,
        HttpRes.message.BAD_REQUEST,
        HttpRes.details.BAD_REQUEST,
      );
    }

    // verify token
    const { uid } = verifyToken(token as string);
    if (!uid) {
      throw new CustomError(
        HttpRes.status.BAD_REQUEST,
        HttpRes.message.BAD_REQUEST,
        HttpRes.details.BAD_REQUEST,
      );
    }

    // update user verified status
    await AuthService.updateUser(uid, { verified: true });

    res.status(HttpRes.status.REDIRECT).redirect("http://localhost:2000");
  },
);

export const RefreshToken = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    const { role, uid } = (req as CustomRequest).user;
    const token = req.headers.authorization?.split(" ")[1];

    // validate token
    if (!token) {
      throw new CustomError(
        HttpRes.status.UNAUTHORIZED,
        HttpRes.message.UNAUTHORIZED,
        HttpRes.details.UNAUTHORIZED,
      );
    }

    // check if token exist in redis
    const session = await redis.get(token as string);
    if (!session) {
      return res.status(HttpRes.status.REDIRECT).json(
        ResponseHandler.success(HttpRes.message.UNAUTHORIZED, {
          redirectUrl: "/auth/login",
        }),
      );
    }

    // revoke old token
    await redis.del(token as string);

    // generate new token
    const newToken = crypto.randomBytes(512).toString("hex").normalize();
    await redis.set(
      newToken,
      JSON.stringify({ uid, role }),
      "EX",
      60 * 60 * 24, // seconds
    );

    // get user data
    const user = await AuthService.getUser(uid);

    res
      .header("Authorization", `Bearer ${newToken}`)
      .status(HttpRes.status.OK)
      .json(ResponseHandler.success(HttpRes.message.OK, user));
  },
);
