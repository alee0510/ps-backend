import dotenv from "dotenv";
import * as Yup from "yup";

// config dotenv
dotenv.config();

// create type for config
export interface Config {
  PORT: number;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
}

// create schema for validation
const schema = Yup.object().shape({
  PORT: Yup.number().default(2000).required(),
  NODE_ENV: Yup.string().default("development").required(),
  DB_HOST: Yup.string().default("localhost").required(),
  DB_PORT: Yup.number().default(5432).required(),
  DB_NAME: Yup.string().required("DB_NAME is required"),
  DB_USER: Yup.string().required("DB_USER is required"),
  DB_PASSWORD: Yup.string().required("DB_PASSWORD is required"),
});

// validate config
try {
  schema.validateSync(process.env, { abortEarly: false });
} catch (error) {
  console.error("Invalid config:", (error as Yup.ValidationError).errors);
  process.exit(1);
}

// load config
const loadConfig = () => {
  return schema.cast(process.env);
};

// export config
export default Object.freeze<Config>({
  ...loadConfig(),
});
