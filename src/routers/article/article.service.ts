import database from "@/lib/prisma";

export async function getArticles({
  page,
  limit,
}: {
  page: string;
  limit: string;
}) {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  return await database.article.findMany({
    skip: offset || 0,
    take: parseInt(limit) || 10,
    where: { published: true },
  });
}

export async function getArticleById(id: number) {
  return await database.article.findUnique({
    where: { id, published: true },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
}

export async function createArticle(data: { title: string; content: string }) {
  return await database.article.create({
    data,
  });
}

export async function deleteArticle(id: number) {
  return await database.article.update({
    where: { id },
    data: { published: false },
  });
}

export default {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
};
