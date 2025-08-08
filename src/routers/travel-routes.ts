import { Router } from "express";
import TravelController from "@/controllers/travel-routes";

// create a new router instance
const travelRouter = Router();

// define routes for travel
travelRouter.get("/routes-travel", TravelController.getTravelRoutes);

// export the travel router
export default travelRouter;
