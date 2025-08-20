import database from "@/lib/prisma";

export async function searchUser(payload: {
  email?: string;
  username?: string;
}) {
  return await database.user.findFirst({
    where: payload,
    select: {
      uid: true,
      username: true,
      email: true,
      role: true,
      verified: true,
      active: true,
      salt: true,
      password: true,
    },
  });
}

export async function createUser(data: {
  username: string;
  email: string;
  salt: string;
  password: string;
}) {
  return await database.user.create({
    data,
    select: {
      uid: true,
      username: true,
      email: true,
      role: true,
      verified: true,
      active: true,
    },
  });
}
