import { createRouter } from "@/lib/utils";
import * as AuthController from "./auth.handler";

const authRouter = createRouter();

authRouter.post("/auth/register", AuthController.Register);
authRouter.post("/auth/login", AuthController.Login);

export default authRouter;
