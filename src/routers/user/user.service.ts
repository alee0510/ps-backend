import database from "@/lib/prisma";

export async function getUsers() {
  return await database.user.findMany({
    where: { active: true },
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

export async function getUserById(uid: string) {
  return await database.user.findFirst({
    where: { uid, active: true },
    select: {
      uid: true,
      username: true,
      email: true,
      role: true,
      verified: true,
      active: true,
      profile: {
        select: {
          bio: true,
          image: true,
        },
      },
    },
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

export async function updateProfile(uid: string, data: Record<string, any>) {
  return await database.profile.update({
    where: { userId: uid },
    data,
  });
}
