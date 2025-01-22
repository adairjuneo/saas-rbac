import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { listMembers } from './list-projects.controller';

export const membersRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(listMembers);
};
