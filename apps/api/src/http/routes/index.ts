import { FastifyInstance } from 'fastify';

import { usersRoutes } from '../controllers/users/routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(usersRoutes, { prefix: '/users' });
};
