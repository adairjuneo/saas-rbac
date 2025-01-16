import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createOrganization } from './create-organization.controller';
import { getMembership } from './get-membership.controller';

export const organizationsRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createOrganization);
  app.register(auth).register(getMembership);
};
