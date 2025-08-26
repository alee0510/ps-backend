import Redis from "ioredis";
import { Logger } from "@/lib/utils";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

redis.on("connect", () => {
  Logger.info("Redis connected");
});
redis.on("error", (error: Error) => {
  Logger.error("Redis error:", error);
});

export default redis;
