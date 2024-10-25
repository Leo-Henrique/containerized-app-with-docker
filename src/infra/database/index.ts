import { drizzle as drizzleClient } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";

export const postgresPool = new Pool({
  user: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DATABASE,
});

export const drizzle = drizzleClient(postgresPool, {
  logger: env.NODE_ENV === "development",
});
