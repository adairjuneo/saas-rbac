import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createOrganization } from './create-organization.controller';

export const organizationsRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createOrganization);
};
