import dotenv from "dotenv";
import * as Yup from "yup";

// config dotenv
dotenv.config();

// create type for config
export interface Config {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  GMAIL_APP_PASSWORD: string;
  GMAIL_USER: string;
}

// create schema for validation
const schema = Yup.object().shape({
  PORT: Yup.number().default(2000).required(),
  NODE_ENV: Yup.string().default("development").required(),
  DATABASE_URL: Yup.string().required("DATABASE_URL is required"),
  JWT_SECRET: Yup.string().required("JWT_SECRET is required"),
  GMAIL_APP_PASSWORD: Yup.string().required("GMAIL_APP_PASSWORD is required"),
  GMAIL_USER: Yup.string().email().required("GMAIL_USER is required"),
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
