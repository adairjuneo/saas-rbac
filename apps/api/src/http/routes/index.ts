import { FastifyInstance } from 'fastify';

import { authRoutes } from '../controllers/auth/routes';
import { organizationsRoutes } from '../controllers/organizations/routes';
import { projectsRoutes } from '../controllers/projects/routes';
import { usersRoutes } from '../controllers/users/routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(usersRoutes, { prefix: '/users' });
  app.register(organizationsRoutes, { prefix: '/organizations' });
  app.register(projectsRoutes, { prefix: '/projects' });
};
