import { Request, Response, NextFunction } from "express";
import { ResponseHandler, CustomError, CreateArticleSchema } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";
import database from "@/lib/prisma";

const ArticleController = {
  getArticles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      // pagination and searching -> by title or author name
      const result = await database.article.findMany({
        take: parseInt(limit as string) || 10,
        skip: offset || 0,
        where: { published: true },
      });

      res
        .status(HttpRes.status.OK)
        .json(ResponseHandler.success(HttpRes.message.OK, result));
    } catch (error) {
      next(error);
    }
  },
  getArticleById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);

      // get article by its id
      const result = await database.article.findUnique({
        where: { id, published: true },
        select: {
          id: true,
          title: true,
          content: true,
          authorId: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      res
        .status(HttpRes.status.OK)
        .json(ResponseHandler.success(HttpRes.message.OK, result));
    } catch (error) {
      next(error);
    }
  },
  createArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // input validation
      await CreateArticleSchema.validate(req.body, {
        abortEarly: false,
      });

      // check if author exist
      const author = await database.user.findUnique({
        where: { uid: req.body.authorId },
      });
      if (!author) {
        throw new CustomError(
          HttpRes.status.NOT_FOUND,
          HttpRes.message.NOT_FOUND,
          HttpRes.details.NOT_FOUND + ": Author not found",
        );
      }

      // create article
      const newArticle = await database.article.create({
        data: req.body,
      });

      res
        .status(HttpRes.status.CREATED)
        .json(ResponseHandler.success(HttpRes.message.CREATED, newArticle));
    } catch (error) {
      next(error);
    }
  },
  deleteArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      // check if article exist
      const article = await database.article.findUnique({
        where: { id, published: true },
      });
      if (!article) {
        throw new CustomError(
          HttpRes.status.NOT_FOUND,
          HttpRes.message.NOT_FOUND,
          HttpRes.details.NOT_FOUND + ": Article not found",
        );
      }

      // soft delete article
      await database.article.update({
        where: { id },
        data: { published: false },
      });

      res
        .status(HttpRes.status.NO_CONTENT)
        .json(ResponseHandler.success(HttpRes.message.DELETED, null));
    } catch (error) {
      next(error);
    }
  },
};

export default ArticleController;
