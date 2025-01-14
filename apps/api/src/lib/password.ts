import bcrypt from 'bcryptjs';

import { env } from '@/env';

export const hashPassword = async (password: string) => {
  const passwordHash = await bcrypt.hash(password, env.AUTH_SALT_PASSWORD_HASH);

  return passwordHash;
};

export const comparePassword = async (password: string, toCompare: string) => {
  const passwordIsTheSame = await bcrypt.compare(password, toCompare);

  return passwordIsTheSame;
};
