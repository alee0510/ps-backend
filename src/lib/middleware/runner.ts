import type { Request, Response } from "express";

// Promise-ify
export function runMiddleware(
  req: Request,
  res: Response,
  fn: (req: Request, res: Response, cb: (result: any) => void) => void,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
