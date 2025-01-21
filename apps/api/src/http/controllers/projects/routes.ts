import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createProject } from './create-project.controller';

export const projectsRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createProject);
};
