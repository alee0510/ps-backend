import { Request, Response, NextFunction } from "express";
import * as Utils from "@/utils";
import database from "@/config/database";

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
        .status(Utils.SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.OPERATION_SUCCESSFUL,
            result,
          ),
        );
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
        .status(Utils.SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.OPERATION_SUCCESSFUL,
            result,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
  createArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // input validation
      await Utils.CreateArticleSchema.validate(req.body, {
        abortEarly: false,
      });

      // check if author exist
      const author = await database.user.findUnique({
        where: { uid: req.body.authorId },
      });
      if (!author) {
        throw new Utils.CustomError(
          Utils.ERROR_CODES.NOT_FOUND,
          Utils.ERROR_MESSAGE.NOT_FOUND,
          Utils.ERROR_DETAILS.NOT_FOUND + ": Author not found",
        );
      }

      // create article
      const newArticle = await database.article.create({
        data: req.body,
      });

      res
        .status(Utils.SUCCESS_CODES.RESOURCE_CREATED)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.RESOURCE_CREATED,
            newArticle,
          ),
        );
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
        throw new Utils.CustomError(
          Utils.ERROR_CODES.NOT_FOUND,
          Utils.ERROR_MESSAGE.NOT_FOUND,
          Utils.ERROR_DETAILS.NOT_FOUND + ": Article not found",
        );
      }

      // soft delete article
      await database.article.update({
        where: { id },
        data: { published: false },
      });

      res
        .status(Utils.SUCCESS_CODES.RESOURCE_DELETED)
        .json(
          Utils.ResponseHandler.success(
            Utils.SUCCESS_MESSAGE.RESOURCE_DELETED,
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
};

export default ArticleController;
