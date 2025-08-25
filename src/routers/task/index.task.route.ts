import { createRouter } from "@/lib/utils";
import * as TaskController from "./task.handler";

const taskRouter = createRouter();

taskRouter.get("/tasks", TaskController.getTasks);

export default taskRouter;
