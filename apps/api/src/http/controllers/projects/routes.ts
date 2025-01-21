import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createProject } from './create-project.controller';
import { deleteProject } from './delete-project.controller';

export const projectsRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createProject);
  app.register(auth).register(deleteProject);
};
