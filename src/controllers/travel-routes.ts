import { NextFunction, Request, Response } from "express";
import {
  ResponseHandler,
  JSONHandler,
  SUCCESS_CODES,
  SUCCESS_MESSAGE,
} from "@/utils";
import { TravelRoute } from "@/types/travel-routes";

// setup travel controller
const TravelController = {
  getTravelRoutes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Read the travel routes from the JSON file
      const DATA = await JSONHandler.read("../../json/data.json");

      // filer the routes based on the query parameters (from, to, depature date, and depature time)
      const { from, to, date, time } = req.query;

      let routes: TravelRoute[] = DATA.routes;
      // Filter by 'from' location
      if (from && typeof from === "string") {
        routes = routes.filter(
          (route: TravelRoute) =>
            route.departure_city.toLowerCase() === from.toLowerCase(),
        );
      }

      // Filter by 'to' location
      if (to && typeof to === "string") {
        routes = routes.filter(
          (route: TravelRoute) =>
            route.destination_city.toLowerCase() === to.toLowerCase(),
        );
      }

      // Filter by 'date' (departure date)
      if (date) {
        const queryDate = new Date(date as string);
        // format date on JSON "2025-08-10T06:00:00+07:00"
        // format date on query "2025-08-10" -> "YYYY-MM-DD"
        routes = routes.filter((route: TravelRoute) =>
          route.schedules.some((schedule) => {
            const scheduleDate = new Date(schedule.departure_time);
            return (
              scheduleDate.toISOString().split("T")[0] ===
              queryDate.toISOString().split("T")[0]
            );
          }),
        );
      }

      // Filter by 'time' (departure time)
      if (time) {
        const queryTime = time as string; // e.g. "08:00"
        routes = routes.filter((route: TravelRoute) =>
          route.schedules.some((schedule) => {
            const scheduleTime = new Date(schedule.departure_time);
            const formattedTime = scheduleTime
              .toISOString()
              .split("T")[1]
              .substring(0, 5); // "HH:MM"
            return formattedTime === queryTime;
          }),
        );
      }

      res
        .status(SUCCESS_CODES.OPERATION_SUCCESSFUL)
        .json(
          ResponseHandler.success(SUCCESS_MESSAGE.OPERATION_SUCCESSFUL, routes),
        );
    } catch (error) {
      next(error);
    }
  },
};

export default TravelController;
