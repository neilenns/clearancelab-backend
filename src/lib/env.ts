import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  SSL_PRIVATE_KEY_PATH: z.string().default(""),
  SSL_FULL_CHAIN_PATH: z.string().default(""),
  MONGO_DB_CONNECTION_STRING: z.string(),
  MONGO_DB_NAME: z.string().default("plan-verifier"),
  PORT: z.coerce.number().default(3001),
  TRUST_PROXY: z.coerce.number().default(0),
  VERSION: z.string().default("dev"),
  WHITELISTED_DOMAINS: z.string().default("http://localhost:*"),
});

export const ENV = envSchema.parse(process.env);

export const getEnvIssues = (): z.ZodIssue[] | undefined => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;

  return undefined;
};
