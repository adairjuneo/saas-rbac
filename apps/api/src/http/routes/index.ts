import { FastifyInstance } from 'fastify';

import { authRoutes } from '../controllers/auth/routes';
import { billingRoutes } from '../controllers/billing/routes';
import { invitesRoutes } from '../controllers/invites/routes';
import { membersRoutes } from '../controllers/members/routes';
import { organizationsRoutes } from '../controllers/organizations/routes';
import { projectsRoutes } from '../controllers/projects/routes';
import { uploadRoutes } from '../controllers/upload/route';
import { usersRoutes } from '../controllers/users/routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(uploadRoutes, { prefix: '/upload' });
  app.register(usersRoutes, { prefix: '/users' });
  app.register(billingRoutes, { prefix: '/billing' });
  app.register(organizationsRoutes, { prefix: '/organizations' });
  app.register(projectsRoutes, { prefix: '/projects' });
  app.register(membersRoutes, { prefix: '/members' });
  app.register(invitesRoutes, { prefix: '/invites' });
};
