import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import * as Utils from "@/lib/utils";
import database from "@/lib/prisma";

const UsersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // do qeuery from database
      const result = await database.user.findMany({
        where: { active: true },
      });

      res
        .status(Utils.SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.OPERATION_SUCCESSFUL,
            result,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate request body
      await Utils.RegisterSchema.validate(req.body, { abortEarly: false });

      // check if user already exists
      const user = await database.user.findUnique({
        where: { email: req.body.email },
      });
      if (user) {
        throw new Utils.CustomError(
          Utils.ERROR_CODES.BAD_REQUEST,
          Utils.ERROR_MESSAGE.BAD_REQUEST,
          Utils.ERROR_DETAILS.BAD_REQUEST + ": User already exists",
        );
      }

      // create new user
      const newUser = await database.user.create({
        data: {
          uid: crypto.randomUUID(),
          ...req.body,
        },
      });

      res
        .status(Utils.SUCCESS_CODES.RESOURCE_CREATED)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.RESOURCE_CREATED,
            newUser,
          ),
        );
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
        throw new Utils.CustomError(
          Utils.ERROR_CODES.BAD_REQUEST,
          Utils.ERROR_MESSAGE.BAD_REQUEST,
          Utils.ERROR_DETAILS.BAD_REQUEST + ": No data to update",
        );
      }

      // if data exist (req.body)
      const valid = await Utils.UpdateUserSchema.validate(req.body, {
        abortEarly: false,
      });
      console.log("is valid", valid);

      // check if user exist
      const user = await database.user.findUnique({
        where: { uid, active: true },
      });
      if (!user) {
        throw new Utils.CustomError(
          Utils.ERROR_CODES.NOT_FOUND,
          Utils.ERROR_MESSAGE.NOT_FOUND,
          Utils.ERROR_DETAILS.NOT_FOUND +
            ": User with uid: " +
            uid +
            " not found",
        );
      }

      // update user
      const updatedUser = await database.user.update({
        where: { uid },
        data: req.body,
      });
      res
        .status(Utils.SUCCESS_CODES.RESOURCE_UPDATED)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.RESOURCE_UPDATED,
            updatedUser,
          ),
        );
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
        throw new Utils.CustomError(
          Utils.ERROR_CODES.NOT_FOUND,
          Utils.ERROR_MESSAGE.NOT_FOUND,
          Utils.ERROR_DETAILS.NOT_FOUND,
        );
      }

      // soft delete
      await database.user.update({
        where: { uid },
        data: { active: false },
      });
      res
        .status(Utils.SUCCESS_CODES.RESOURCE_DELETED)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.RESOURCE_DELETED,
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
};

export default UsersController;
