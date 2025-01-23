import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { acceptInvite } from './accept-invite.controller';
import { createInvite } from './create-invite.controller';
import { getInviteDetails } from './get-invite-details.controller';
import { listInvitesOfOrganization } from './list-invite-of-organization.controller';
import { rejectInvite } from './reject-invite.controller';
import { revokeInvite } from './revoke-invite.controller';

export const invitesRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createInvite);
  app.register(getInviteDetails);
  app.register(auth).register(listInvitesOfOrganization);
  app.register(auth).register(acceptInvite);
  app.register(auth).register(rejectInvite);
  app.register(auth).register(revokeInvite);
};
