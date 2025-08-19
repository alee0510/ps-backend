import path from "path";
import { promises as fs } from "fs";
import { CustomError } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";

export const JSONHandler = Object.freeze({
  read: async (relativePath: string): Promise<any> => {
    try {
      const FILE_PATH = path.join(__dirname, relativePath);
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      return JSON.parse(RAW_DATA);
    } catch (error) {
      console.error(`Error reading JSON file at ${relativePath}:`, error);
      throw new CustomError(
        HttpRes.status.INTERNAL_SERVER_ERROR,
        HttpRes.message.INTERNAL_SERVER_ERROR,
        HttpRes.details.INTERNAL_SERVER_ERROR +
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
        HttpRes.status.INTERNAL_SERVER_ERROR,
        HttpRes.message.INTERNAL_SERVER_ERROR,
        HttpRes.details.INTERNAL_SERVER_ERROR +
          `: cannot write to path ${relativePath}`,
      );
    }
  },
});
