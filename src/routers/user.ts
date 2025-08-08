import { Router } from "express";
import UsersController from "@/controllers/user";

// create a new router instance
const userRouter = Router();

// define routes
userRouter.get("/users", UsersController.getUsers);
userRouter.get("/users/:id", UsersController.getUserById);
userRouter.post("/users", UsersController.createUser);
userRouter.patch("/users/:id", UsersController.updateUser);
userRouter.delete("/users/:id", UsersController.deleteUser);

export default userRouter;
