import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createInvite } from './create-invite.controller';

export const invitesRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createInvite);
};
