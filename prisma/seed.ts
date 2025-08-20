import { PrismaClient } from "@prisma/client";

// create database instance
const database = new PrismaClient();

// main
export async function main() {
  // do query for seed data
  await database.article.createMany({
    data: [
      {
        title: "The Future of Web Development in 2025",
        content:
          "Web development is rapidly evolving with frameworks like Next.js, Svelte, and Bun gaining traction. Developers are focusing on performance, security, and seamless user experiences. AI-assisted coding tools are also becoming mainstream, speeding up development cycles and improving code quality.",
      },
      {
        title: "Understanding Digital Signatures",
        content:
          "Digital signatures provide a secure way to validate the authenticity of electronic documents. Unlike handwritten signatures, they are based on cryptographic algorithms, ensuring integrity and non-repudiation. Businesses are increasingly adopting digital signatures to streamline workflows and enhance security.",
      },
      {
        title: "A Beginner’s Guide to Express.js",
        content:
          "Express.js is a lightweight and flexible Node.js framework for building APIs and web applications. Its middleware system allows developers to easily handle requests, responses, and errors. With TypeScript support, Express can be both fast to prototype and safe for large-scale applications.",
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
