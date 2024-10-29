import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "testing", "homologation", "production"]),
  PORT: z.coerce.number(),
  PORT_SOCKET: z.coerce.number(),
  URL_FRONT: z.string(),
  URL_BACK: z.string(),

  SECURITY_ALGORITHM: z.string(),
  SECURITY_SECRET: z.string(),
  SECURITY_SALT: z.coerce.number(),

  SALT_OR_ROUNDS: z.coerce.number(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_ACCESS_IN_DAY: z.coerce.number(),
  JWT_EXPIRES_REFRESH_IN_DAY: z.coerce.number(),

  DATABASE_URL: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),

  SESSION_EXPIRES: z.coerce.number(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),

  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

const env = _env.data;

export { env };
