import exprress, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import logger from "@/middleware/logger";

// setup express
const app: Application = exprress();

// setup middleware: body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup middleware: LOGGING
app.use(logger);

// setup middleware: CORS (Cross-Origin Resource Sharing)

// define root routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Express server!",
  });
});

// import user router
import userRouter from "./routers/user";

// use user router
app.use("/api", userRouter);

// export app for server
export default app;
