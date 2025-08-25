import database from "@/lib/prisma";

export async function getTasks() {
  return await database.task.findMany();
}
