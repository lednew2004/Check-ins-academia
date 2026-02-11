import { z } from "zod";
import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["test", "dev", "production"]),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid enviroment variable", _env.error.format);
  throw new Error("Invalid enviroment variable");
}

export const env = _env.data;
