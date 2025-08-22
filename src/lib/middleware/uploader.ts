import type { Request, Response, NextFunction } from "express";
import path from "path";
const multer = require("multer");

// create destination folder if not exist
const mkdirp = require("mkdirp");
mkdirp.sync(path.join(__dirname, "../../../public/images"));

// create storage for multer
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: any,
    cb: (err: Error | null, destination: string) => void,
  ) {
    cb(null, path.join(__dirname, "../../../public/images"));
  },
  filename: function (
    req: Request,
    file: any,
    cb: (err: Error | null, destination: string) => void,
  ) {
    // get extension of file
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
    // images-3819381478147984781749.png
  },
});

// create upload middleware
export const upload = multer({ storage });
