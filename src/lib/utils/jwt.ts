import env from "@/env";
const JWT = require("jsonwebtoken");

export const generateToken = (
  payload: any,
  options?: { expiresIn?: string | number },
): string => {
  return JWT.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  return JWT.verify(token, env.JWT_SECRET);
};
