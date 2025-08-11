import path from "path";
import { promises as fs } from "fs";
import {
  CustomError,
  ERROR_MESSAGE,
  ERROR_DETAILS,
  ERROR_CODES,
} from "@/utils";

export const JSONHandler = Object.freeze({
  read: async (relativePath: string): Promise<any> => {
    try {
      const FILE_PATH = path.join(__dirname, relativePath);
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      return JSON.parse(RAW_DATA);
    } catch (error) {
      console.error(`Error reading JSON file at ${relativePath}:`, error);
      throw new CustomError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        ERROR_DETAILS.INTERNAL_SERVER_ERROR +
          `: cannot read path ${relativePath}`,
      );
    }
  },
  write: async (relativePath: string, data: any): Promise<void> => {
    try {
      const FILE_PATH = path.join(__dirname, relativePath);
      await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error(`Error writing JSON file at ${relativePath}:`, error);
      throw new CustomError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        ERROR_DETAILS.INTERNAL_SERVER_ERROR +
          `: cannot write to path ${relativePath}`,
      );
    }
  },
});
