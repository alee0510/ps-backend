import ArticleController from "@/controllers/article";
import { createRouter } from "@/utils";

// create a new router instance
const articleRouter = createRouter();

articleRouter.get("/articles", ArticleController.getArticles);
articleRouter.get("/articles/:id", ArticleController.getArticleById);
articleRouter.post("/articles", ArticleController.createArticle);
articleRouter.delete("/articles/:id", ArticleController.deleteArticle);

export default articleRouter;
