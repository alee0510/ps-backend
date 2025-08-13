import exprress, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import { errorMiddleware, requestLogger } from "@/middleware";

// setup express
const app: Application = exprress();

// setup middleware: body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup middleware: LOGGING
app.use(requestLogger);

// setup middleware: CORS (Cross-Origin Resource Sharing)

// define root routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Express server!",
  });
});

// import user router
import userRouter from "@/routers/user";
import travelRouter from "@/routers/travel-routes";

// use user router
const routers = [userRouter, travelRouter];
routers.forEach((router) => {
  app.use("/api", router);
});

// setup error handler middleware
app.use(errorMiddleware);

// export app for server
export default app;
