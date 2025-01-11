import type { FastifyInstance } from 'fastify';

import { createUser } from './create-user.controller';

export const usersRoutes = async (app: FastifyInstance) => {
  app.register(createUser);
};
