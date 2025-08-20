import { createHandler } from "@/lib/utils";
import { CreateArticleSchema } from "./article.validation";
import * as ArticleServices from "./article.service";

export const getArticles = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    const query = req.query;

    // pagination and searching -> by title or author name
    const result = await ArticleServices.getArticles(
      query as { page: string; limit: string },
    );

    res
      .status(HttpRes.status.OK)
      .json(ResponseHandler.success(HttpRes.message.OK, result));
  },
);

export const getArticleById = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    const id = parseInt(req.params.id);

    // get article by its id
    const result = await ArticleServices.getArticleById(id);

    res
      .status(HttpRes.status.OK)
      .json(ResponseHandler.success(HttpRes.message.OK, result));
  },
);

export const createArticle = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    // input validation
    await CreateArticleSchema.validate(req.body, {
      abortEarly: false,
    });

    // create article
    const newArticle = await ArticleServices.createArticle(req.body);

    res
      .status(HttpRes.status.CREATED)
      .json(ResponseHandler.success(HttpRes.message.CREATED, newArticle));
  },
);

export const deleteArticle = createHandler(
  async (req, res, next, { CustomError, ResponseHandler, HttpRes }) => {
    const id = parseInt(req.params.id);
    // check if article exist
    const article = await ArticleServices.getArticleById(id);
    if (!article) {
      throw new CustomError(
        HttpRes.status.NOT_FOUND,
        HttpRes.message.NOT_FOUND,
        HttpRes.details.NOT_FOUND + ": Article not found",
      );
    }

    // soft delete article
    await ArticleServices.deleteArticle(id);

    res
      .status(HttpRes.status.NO_CONTENT)
      .json(ResponseHandler.success(HttpRes.message.DELETED, null));
  },
);
