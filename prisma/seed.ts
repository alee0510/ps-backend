import { PrismaClient } from "@prisma/client";

// create database instance
const database = new PrismaClient();

// main
export async function main() {
  // do query for seed data
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
