import database from "@/lib/prisma";

export async function getUsers() {
  return await database.user.findMany({
    where: { active: true },
  });
}

export async function getUserById(uid: string) {
  return await database.user.findFirst({
    where: { uid, active: true },
  });
}

export async function updateUser(
  uid: string,
  data: { name?: string; email?: string },
) {
  return await database.user.update({
    where: { uid },
    data,
  });
}

export async function deleteUser(uid: string) {
  return await database.user.update({
    where: { uid },
    data: { active: false },
  });
}
