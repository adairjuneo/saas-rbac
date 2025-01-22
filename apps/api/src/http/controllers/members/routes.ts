import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { listMembers } from './list-members.controller';
import { updateMember } from './update-member.controller';

export const membersRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(listMembers);
  app.register(auth).register(updateMember);
};
