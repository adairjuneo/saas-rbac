import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { getUserProfile } from './get-user-profile.controller';

export const usersRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(getUserProfile);
};
