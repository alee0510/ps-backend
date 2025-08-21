import { createRouter } from "@/lib/utils";
import { authUser } from "@/lib/middleware";
import * as AuthController from "./auth.handler";

const authRouter = createRouter();

authRouter.post("/auth/register", AuthController.Register);
authRouter.post("/auth/login", AuthController.Login);
authRouter.patch(
  "/auth/send-verification-email",
  authUser,
  AuthController.SendVerificationEmail,
);
authRouter.get("/auth/verify-email", AuthController.VerifyEmail);

export default authRouter;
