import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  ResponseHandler,
  SUCCESS_CODES,
  SUCCESS_MESSAGE,
  ERROR_CODES,
  ERROR_MESSAGE,
  ERROR_DETAILS,
} from "@/utils";
import database from "@/config/database";

const UsersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check query
      // const { page, limit } = req.query;
      // const offest =
      //   (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10) || 0;

      // do qeuery from database
      const result = await database.user.findMany();

      res
        .status(SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          ResponseHandler.success(SUCCESS_MESSAGE.OPERATION_SUCCESSFUL, result),
        );
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get user id from params
      const userId = req.params.id;

      // do query from database
      // const result = await database.query(
      //   "SELECT * FROM customer WHERE customer_id = $1;",
      //   [userId],
      // );

      // Check if user exists
      // if (!result.rows.length) {
      //   throw new CustomError(
      //     ERROR_CODES.NOT_FOUND,
      //     ERROR_MESSAGE.NOT_FOUND,
      //     ERROR_DETAILS.NOT_FOUND,
      //   );
      // }

      // respond with success
      res
        .status(SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          ResponseHandler.success(SUCCESS_MESSAGE.OPERATION_SUCCESSFUL, []),
        );
    } catch (error) {
      next(error);
    }
  },
};

export default UsersController;
