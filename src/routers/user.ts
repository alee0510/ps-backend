import { Router } from "express";
import UsersController from "../controllers/user";

// create a new router instance
const userRouter = Router();

// define routes
userRouter.post("/users", UsersController.createUser);

export default userRouter;
