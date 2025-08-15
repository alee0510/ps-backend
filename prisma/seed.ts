import { PrismaClient } from "@prisma/client";

// create database instance
const database = new PrismaClient();

// main
export async function main() {
  // populate user data
  await database.user.createMany({
    data: [
      {
        uid: "d1b88df4-947d-47d7-a5ff-e3a5b1cdfdd8",
        name: "alexa",
        email: "alexa@gmail.com",
        password: "lollipop",
        active: true,
        role: "user",
      },
      {
        uid: "76e7aa2a-7184-42ff-a204-84810477285c",
        name: "lollipop",
        email: "lollipop@gmail.com",
        password: "lollipop",
        active: true,
        role: "user",
      },
    ],
  });

  // populate article data
  await database.article.createMany({
    data: [
      {
        title: "What is Lorem Ipsum?",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        authorId: "d1b88df4-947d-47d7-a5ff-e3a5b1cdfdd8",
      },
    ],
  });
}

// run
main()
  .then(() => {
    console.log("Seed data created");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });
