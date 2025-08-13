import UsersController from "@/controllers/user";
import { createRouter } from "@/utils";

// create a new router instance
const userRouter = createRouter();

// define routes
userRouter.get("/users", UsersController.getUsers);
userRouter.get("/users/:id", UsersController.getUserById);

export default userRouter;
