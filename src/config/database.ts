import { Pool } from "pg";
import Config from "./index";

// create pool connection
const database = new Pool({
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  database: Config.DB_NAME,
  user: Config.DB_USER,
  password: Config.DB_PASSWORD,
});

export default database;
