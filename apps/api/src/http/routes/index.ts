import { FastifyInstance } from 'fastify';

import { authRoutes } from '../controllers/auth/routes';
import { usersRoutes } from '../controllers/users/routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(usersRoutes, { prefix: '/users' });
};
