import dotenv from "dotenv";
import * as Yup from "yup";

// config dotenv
dotenv.config();

// create schema for validation
const schema = Yup.object().shape({
  PORT: Yup.number().default(2000).required(),
  NODE_ENV: Yup.string().default("development").required(),
  DATABASE_URL: Yup.string().required("DATABASE_URL is required"),
  REDIS_HOST: Yup.string().default("localhost").required(),
  REDIS_PORT: Yup.number().default(6379).required(),
  JWT_SECRET: Yup.string().required("JWT_SECRET is required"),
  GMAIL_APP_PASSWORD: Yup.string().required("GMAIL_APP_PASSWORD is required"),
  GMAIL_USER: Yup.string().email().required("GMAIL_USER is required"),
  CLOUD_NAME: Yup.string().required("CLOUD_NAME is required"),
  CLOUD_API_KEY: Yup.string().required("CLOUD_API_KEY is required"),
  CLOUD_API_SECRET: Yup.string().required("CLOUD_API_SECRET is required"),
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
export default Object.freeze<Yup.InferType<typeof schema>>({
  ...loadConfig(),
});
