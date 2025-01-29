import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['dev', 'test', 'production'])
      .default('dev')
      .transform((value) => (value === 'dev' ? 'dev' : value)),
    API_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    PAGINATION_PAGE_SIZE: z.coerce.number().max(20),
    AUTH_SALT_PASSWORD_HASH: z.coerce.number().max(6),
    AUTH_KEY_EXPIRATION_SECONDS: z.coerce.number().min(120),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GITHUB_REDIRECT_URL: z.string().url(),
    GITHUB_USER_DATA_URL: z.string().url(),
    GITHUB_ACCESS_TOKEN_URL: z.string().url(),
    // DATABASE_URL: z.string().url(),
    // OPEN_AI_API_KEY: z.string().min(1),
    // GITHUB_AUTHORIZE_URL: z.string().url(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_PORT: process.env.API_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PAGINATION_PAGE_SIZE: process.env.PAGINATION_PAGE_SIZE,
    AUTH_SALT_PASSWORD_HASH: process.env.AUTH_SALT_PASSWORD_HASH,
    AUTH_KEY_EXPIRATION_SECONDS: process.env.AUTH_KEY_EXPIRATION_SECONDS,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URL: process.env.GITHUB_REDIRECT_URL,
    GITHUB_USER_DATA_URL: process.env.GITHUB_USER_DATA_URL,
    GITHUB_ACCESS_TOKEN_URL: process.env.GITHUB_ACCESS_TOKEN_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
