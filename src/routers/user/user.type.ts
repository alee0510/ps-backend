import { Request } from "express";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};

// file upload type
export type RequestWithFile = Request & {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
};
