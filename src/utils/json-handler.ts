import path from "path";
import { promises as fs } from "fs";
import { CustomError } from "@/utils";

export const JSONHandler = {
  read: async (relativePath: string): Promise<any> => {
    try {
      const FILE_PATH = path.join(__dirname, relativePath);
      const RAW_DATA = await fs.readFile(FILE_PATH, "utf-8");
      return JSON.parse(RAW_DATA);
    } catch (error) {
      console.error(`Error reading JSON file at ${relativePath}:`, error);
      throw new CustomError(
        500,
        "Internal Server Error",
        `Failed to read JSON file: ${relativePath}`,
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
        500,
        "Internal Server Error",
        `Failed to write JSON file: ${relativePath}`,
      );
    }
  },
};
