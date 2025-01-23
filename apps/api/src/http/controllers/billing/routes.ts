import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { getOrganizationBilling } from './get-organization-billing.controller';

export const billingRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(getOrganizationBilling);
};
