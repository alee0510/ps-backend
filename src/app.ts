import exprress, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import { errorMiddleware, requestLogger } from "@/lib/middleware";

const cors = require("cors");

// setup express
const app: Application = exprress();

// setup middleware: body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup middleware: LOGGING
app.use(requestLogger);

// setup middleware: CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    exposedHeaders: ["Authorization"],
    origin: ["http://localhost:3000"],
  }),
);

// expose public folder
app.use("/public", exprress.static("public"));

// define root routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Express server!",
  });
});

// import user router
import userRouter from "@/routers/user/index.user.route";
import articleRouter from "@/routers/article/index.article.route";
import authRouter from "@/routers/auth/index.auth.route";
import taskRouter from "@/routers/task/index.task.route";

// use user router
const routers = [userRouter, articleRouter, authRouter, taskRouter];
routers.forEach((router) => {
  app.use("/api", router);
});

// setup error handler middleware
app.use(errorMiddleware);

// export app for server
export default app;
