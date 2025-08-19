import { Request, Response, NextFunction } from "express";
import { ResponseHandler, CustomError, UpdateUserSchema } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";
import database from "@/lib/prisma";

const UsersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // do qeuery from database
      const result = await database.user.findMany({
        where: { active: true },
      });

      res
        .status(HttpRes.status.OK)
        .json(ResponseHandler.success(HttpRes.message.OK, result));
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // params & body
      const { uid } = req.params;

      // validate req.body { name?, email? }
      const keys = Object.keys(req.body);
      if (!keys.length) {
        throw new CustomError(
          HttpRes.status.BAD_REQUEST,
          HttpRes.message.BAD_REQUEST,
          HttpRes.details.BAD_REQUEST + ": No data to update",
        );
      }

      // if data exist (req.body)
      const valid = await UpdateUserSchema.validate(req.body, {
        abortEarly: false,
      });
      console.log("is valid", valid);

      // check if user exist
      const user = await database.user.findUnique({
        where: { uid, active: true },
      });
      if (!user) {
        throw new CustomError(
          HttpRes.status.NOT_FOUND,
          HttpRes.message.NOT_FOUND,
          HttpRes.details.NOT_FOUND + ": User with uid: " + uid + " not found",
        );
      }

      // update user
      const updatedUser = await database.user.update({
        where: { uid },
        data: req.body,
      });
      res
        .status(HttpRes.status.OK)
        .json(ResponseHandler.success(HttpRes.message.UPDATED, updatedUser));
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;

      // check if user exist and status active
      const user = await database.user.findUnique({
        where: { uid, active: true },
      });
      if (!user) {
        throw new CustomError(
          HttpRes.status.NOT_FOUND,
          HttpRes.message.NOT_FOUND,
          HttpRes.details.NOT_FOUND,
        );
      }

      // soft delete
      await database.user.update({
        where: { uid },
        data: { active: false },
      });
      res
        .status(HttpRes.status.NO_CONTENT)
        .json(ResponseHandler.success(HttpRes.message.DELETED, null));
    } catch (error) {
      next(error);
    }
  },
};

export default UsersController;
