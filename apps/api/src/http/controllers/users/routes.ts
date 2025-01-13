import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { getUserProfile } from './session-user.controller';

export const usersRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(getUserProfile);
};
