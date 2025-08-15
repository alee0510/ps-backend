import UsersController from "@/controllers/user";
import { createRouter } from "@/utils";

// create a new router instance
const userRouter = createRouter();

// define routes
userRouter.get("/users", UsersController.getUsers);
userRouter.post("/users", UsersController.createUser);
userRouter.patch("/users/:uid", UsersController.updateUser);
userRouter.delete("/users/:uid", UsersController.deleteUser);

export default userRouter;
