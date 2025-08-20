import env from "@/env";
const JWT = require("jsonwebtoken");

export const generateToken = (payload: any): string => {
  return JWT.sign(payload, env.JWT_SECRET);
};

export const verifyToken = (token: string): any => {
  return JWT.verify(token, env.JWT_SECRET);
};
