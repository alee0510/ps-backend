import { createRouter } from "@/lib/utils";
import { authAdmin } from "@/lib/middleware";
import UsersController from "./user.handler";

// create a new router instance
const userRouter = createRouter();

// define routes
userRouter.get("/users", authAdmin, UsersController.getUsers);
userRouter.patch("/users/:uid", authAdmin, UsersController.updateUser);
userRouter.delete("/users/:uid", authAdmin, UsersController.deleteUser);

export default userRouter;
