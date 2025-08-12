import { Router } from "express";
import UsersController from "@/controllers/user";

// create a new router instance
const userRouter = Router();

// define routes
userRouter.get("/users", UsersController.getUsers);
userRouter.get("/users/:id", UsersController.getUserById);

export default userRouter;
