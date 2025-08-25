import { createHandler } from "@/lib/utils";
import * as TaskServices from "./task.service";

export const getTasks = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    const result = await TaskServices.getTasks();
    res
      .status(HttpRes.status.OK)
      .json(ResponseHandler.success(HttpRes.message.OK, result));
  },
);
