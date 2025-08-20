import { Request, Response, NextFunction } from "express";
import database from "@/lib/prisma";
import {
  ResponseHandler,
  CustomError,
  hashPassword,
  generateSalt,
  verifyPassword,
} from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";
import { RegisterSchema, LoginSchema } from "./auth.validation";
import env from "@/env";
const jwt = require("jsonwebtoken");

export async function Register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // validate request body
    const { username, email, password } = await RegisterSchema.validate(
      req.body,
      { abortEarly: false },
    );

    // check if user already exists
    const user = await database.user.findFirst({
      where: { email: req.body.email, username: req.body.username },
    });
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
    const newUser = await database.user.create({
      data: {
        username,
        email,
        salt,
        password: hashedPassworrd,
      },
      select: {
        uid: true,
        username: true,
        email: true,
        role: true,
        verified: true,
        active: true,
      },
    });

    res
      .status(HttpRes.status.CREATED)
      .json(ResponseHandler.success(HttpRes.message.CREATED, newUser));
  } catch (error) {
    next(error);
  }
}

export async function Login(req: Request, res: Response, next: NextFunction) {
  try {
    // do input validation
    const { password } = await LoginSchema.validate(req.body, {
      abortEarly: false,
    });

    // check if user exists
    const user = await database.user.findFirst({
      where: { email: req.body.email },
      select: {
        uid: true,
        username: true,
        email: true,
        role: true,
        verified: true,
        active: true,
        salt: true,
        password: true,
      },
    });
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

    // generate session token
    const token = jwt.sign({ uid: user.uid, role: user.role }, env.JWT_SECRET);

    // return response
    res
      .header("Authorization", `Bearer ${token}`)
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
  } catch (error) {
    next(error);
  }
}
