import { createRouter } from "@/lib/utils";
import { authAdmin, authUser, upload } from "@/lib/middleware";
import * as UsersController from "./user.handler";

// create a new router instance
const userRouter = createRouter();

// define routes
userRouter.get("/users", authAdmin, UsersController.getUsers);
userRouter.get("/users/:uid", authUser, UsersController.getUserById);
userRouter.patch("/users/:uid", authAdmin, UsersController.updateUser);
userRouter.delete("/users/:uid", authAdmin, UsersController.deleteUser);
userRouter.patch(
  "/users/:uid/profile/image",
  authUser,
  upload.single("image"),
  UsersController.updateUserProfileImage,
);

export default userRouter;
