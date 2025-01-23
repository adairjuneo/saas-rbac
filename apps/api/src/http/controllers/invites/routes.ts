import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createInvite } from './create-invite.controller';
import { getInviteDetails } from './get-invite-details.controller';

export const invitesRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createInvite);
  app.register(auth).register(getInviteDetails);
};
