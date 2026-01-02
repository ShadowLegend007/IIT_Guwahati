import dotenv from "dotenv";
dotenv.config();

const required = (key) => {
  if (!process.env[key]) {
    process.exit(1);
  }
  return process.env[key];
};

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  DB_URL: required("DB_URL"),
  JWT_SECRET: required("JWT_SECRET"),
});

export default env; 