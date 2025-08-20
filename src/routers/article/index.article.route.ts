import { createRouter } from "@/lib/utils";
import { authUser, authAdmin } from "@/lib/middleware";
import ArticleController from "./article.handler";

// create a new router instance
const articleRouter = createRouter();

articleRouter.get("/articles", authUser, ArticleController.getArticles);
articleRouter.get("/articles/:id", authUser, ArticleController.getArticleById);
articleRouter.post("/articles", authAdmin, ArticleController.createArticle);
articleRouter.delete(
  "/articles/:id",
  authAdmin,
  ArticleController.deleteArticle,
);

export default articleRouter;
