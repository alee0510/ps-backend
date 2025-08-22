import path from "path";
import type { Request, Response } from "express";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";
import { CustomError } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";
import { runMiddleware } from "./runner";

// import multer & mkdirp
const multer = require("multer");
const mkdirp = require("mkdirp");

// type
export type File = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
};
export type DiskFile = File & {
  destination: string;
  filename: string;
  path: string;
};
export type MemoryFile = File & {
  buffer: Buffer;
};
export type CustomRequestWithFile<T extends MemoryFile | DiskFile> = Request & {
  file: T;
};
export type CustomRequestWithCloudinary = Request & {
  cloudinary: UploadApiResponse;
};

// create middleware to upload image
export function uploadToLocalDisk(fieldName: string, relativePath: string) {
  // create destination folder if not exist
  mkdirp.sync(path.join(__dirname, relativePath));

  // create multer storage
  const diskStorage = multer.diskStorage({
    destination: function (
      req: Request,
      file: File,
      cb: (err: Error | null, destination: string) => void,
    ) {
      cb(null, path.join(__dirname, relativePath));
    },
    filename: function (
      req: Request,
      file: File,
      cb: (err: Error | null, destination: string) => void,
    ) {
      // get extension of file
      const ext = file.mimetype.split("/")[1];
      cb(null, file.fieldname + "-" + Date.now() + "." + ext);
    },
  });

  // create multer middleware
  const upload = multer({ storage: diskStorage }).single(fieldName);
  return async function (req: Request, res: Response) {
    await runMiddleware(req, res, upload);
  };
}

export function uploadToCloudinary(fieldName: string) {
  const upload = multer({ storage: multer.memoryStorage() }).single(fieldName);
  return async function (req: Request, res: Response) {
    // upload image to multer
    await runMiddleware(req, res, upload);

    // check if file is uploaded
    if (!(req as CustomRequestWithFile<MemoryFile>).file) {
      throw new CustomError(
        HttpRes.status.BAD_REQUEST,
        HttpRes.message.BAD_REQUEST,
        HttpRes.details.BAD_REQUEST,
      );
    }

    // convert buffer to base64
    const b64 = Buffer.from(
      (req as CustomRequestWithFile<MemoryFile>).file.buffer,
    ).toString("base64");
    const dataURI =
      "data:" +
      (req as CustomRequestWithFile<MemoryFile>).file.mimetype +
      ";base64," +
      b64;

    // upload image to cloudinary
    const response = await cloudinary.uploader.upload(dataURI, {
      folder: "images",
      resource_type: "image",
    });

    // modify req object to include .cloudinary
    (req as CustomRequestWithCloudinary).cloudinary = response;
  };
}
