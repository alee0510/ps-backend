import dotenv from 'dotenv';

// config dotenv
dotenv.config();

// create type for config
export interface Config {
  PORT: number;
  NODE_ENV: string;
}

// create config object
const config: Config = {
  PORT: parseInt(process.env.PORT || '2000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// export config
export default config;