import packageJson from "@/../package.json";
import { config } from "dotenv";
import { z } from "zod";

config({ override: true });

type ProcessEnvNodeEnv = z.infer<typeof nodeEnvSchema> | undefined;

const nodeEnvSchema = z.enum(["test", "development", "production"]);

const schema = z.object({
  NODE_ENV: nodeEnvSchema.default(
    (process.env.NODE_ENV as ProcessEnvNodeEnv) ?? "development",
  ),
  API_NAME: z.string().default(packageJson.name),
  API_HOST: z.string().ip({ version: "v4" }),
  API_PORT: z.coerce.number().transform(val => val - 1),
  API_ACCESS_PERMISSION_CLIENT_SIDE: z.string().default("*"),
  POSTGRES_HOST: z.string().ip({ version: "v4" }),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USERNAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  NETWORK_SUBNET: z.string(),
});

const parsedEnv = schema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(parsedEnv.error.flatten().fieldErrors);

  throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
