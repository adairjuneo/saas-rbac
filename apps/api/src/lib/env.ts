import chalk from 'chalk';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  PAGINATION_PAGE_SIZE: z.coerce.number().max(20),
  AUTH_SALT_PASSWORD_HASH: z.coerce.number().max(6),
  AUTH_KEY_EXPIRATION_SECONDS: z.coerce.number().min(120),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  // GITHUB_AUTHORIZE_URL: z.string().url(),
  GITHUB_REDIRECT_URL: z.string().url(),
  GITHUB_USER_DATA_URL: z.string().url(),
  GITHUB_ACCESS_TOKEN_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(
    chalk.bgRedBright('❌ Invalid environment variables.'),
    _env.error.format()
  );

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
