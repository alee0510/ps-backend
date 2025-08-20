import {
  hashPassword,
  generateSalt,
  verifyPassword,
  generateToken,
  createHandler,
} from "@/lib/utils";
import { RegisterSchema, LoginSchema } from "./auth.validation";
import * as AuthService from "./auth.service"; // eslint-disable-line

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

    res
      .status(HttpRes.status.CREATED)
      .json(ResponseHandler.success(HttpRes.message.CREATED, newUser));
  },
);

export const Login = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
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

    // generate session token
    const token = generateToken({
      uid: user.uid,
      role: user.role,
    });

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
  },
);
