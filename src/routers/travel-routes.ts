import TravelController from "@/controllers/travel-routes";
import { createRouter } from "@/utils";

// create a new router instance
const travelRouter = createRouter();

// define routes for travel
travelRouter.get("/routes-travel", TravelController.getTravelRoutes);

// export the travel router
export default travelRouter;
