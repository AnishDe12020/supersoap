import * as dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid("production", "development", "test").required(),
  PORT: Joi.string().required().default("4000"),
  CORS_ORIGIN: Joi.string().required().default("*"),
  ACCESS_TOKEN_SECRET: Joi.string().min(8).required(),
  ACCESS_TOKEN_EXPIRE: Joi.string().required().default("20m"),
  MAINNET_RPC: Joi.string().required(),
  NFT_STORAGE_KEY: Joi.string().required(),
  PRIVATE_KEY: Joi.string().required(),
});

const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join("\n")}`
  );
}

const config = {
  node_env: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  cors: {
    cors_origin: validatedEnv.CORS_ORIGIN,
  },
  rpc: validatedEnv.MAINNET_RPC,
  jwt: {
    access_token: {
      secret: validatedEnv.ACCESS_TOKEN_SECRET,
      expire: validatedEnv.ACCESS_TOKEN_EXPIRE,
    },
  },
  nftStorage: validatedEnv.NFT_STORAGE_KEY,
  privateKey: validatedEnv.PRIVATE_KEY,
} as const;

export default config;
