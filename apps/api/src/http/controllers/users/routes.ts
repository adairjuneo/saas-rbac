import type { FastifyInstance } from 'fastify';

import { getUserProfile } from './session-user.controller';

export const usersRoutes = async (app: FastifyInstance) => {
  app.register(getUserProfile);
};
