import { createRouter } from "@/lib/utils";
import UsersController from "./user.handler";

// create a new router instance
const userRouter = createRouter();

// define routes
userRouter.get("/users", UsersController.getUsers);
userRouter.patch("/users/:uid", UsersController.updateUser);
userRouter.delete("/users/:uid", UsersController.deleteUser);

export default userRouter;
