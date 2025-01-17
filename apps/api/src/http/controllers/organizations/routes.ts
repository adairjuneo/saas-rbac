import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createOrganization } from './create-organization.controller';
import { getMembership } from './get-membership.controller';
import { getOrganizationByMembership } from './get-organization-by-membership.controller';
import { listOrganizationsByMembership } from './list-organizations-by-membership.controller';

export const organizationsRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createOrganization);
  app.register(auth).register(getMembership);
  app.register(auth).register(getOrganizationByMembership);
  app.register(auth).register(listOrganizationsByMembership);
};
