import Redis from "ioredis";
import { Logger } from "@/lib/utils";
import env from "@/env";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

redis.on("connect", () => {
  Logger.info("Redis connected");
});
redis.on("error", (error: Error) => {
  Logger.error("Redis error:", error);
  process.exit(1);
});

export default redis;
