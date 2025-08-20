import { createHandler } from "@/lib/utils";
import { UpdateUserSchema } from "./user.validation";
import * as UserService from "./user.service";

export const getUsers = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // do qeuery from database
    const result = await UserService.getUsers();

    res
      .status(HttpRes.status.OK)
      .json(ResponseHandler.success(HttpRes.message.OK, result));
  },
);

export const updateUser = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
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
    const user = await UserService.getUserById(uid);
    if (!user) {
      throw new CustomError(
        HttpRes.status.NOT_FOUND,
        HttpRes.message.NOT_FOUND,
        HttpRes.details.NOT_FOUND + ": User with uid: " + uid + " not found",
      );
    }

    // update user
    const updatedUser = await UserService.updateUser(uid, req.body);
    res
      .status(HttpRes.status.OK)
      .json(ResponseHandler.success(HttpRes.message.UPDATED, updatedUser));
  },
);

export const deleteUser = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // params
    const { uid } = req.params;

    // check if user exist and status active
    const user = await UserService.getUserById(uid);
    if (!user) {
      throw new CustomError(
        HttpRes.status.NOT_FOUND,
        HttpRes.message.NOT_FOUND,
        HttpRes.details.NOT_FOUND,
      );
    }

    // soft delete
    await UserService.deleteUser(uid);
    res
      .status(HttpRes.status.NO_CONTENT)
      .json(ResponseHandler.success(HttpRes.message.DELETED, null));
  },
);
