import path from "path";
import { promises as fs } from "fs";

export async function deleteFile(relativePath: string) {
  return await fs.unlink(path.join(__dirname, relativePath));
}
