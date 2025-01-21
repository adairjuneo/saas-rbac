import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { createProject } from './create-project.controller';
import { deleteProject } from './delete-project.controller';
import { getProjectDetails } from './get-project-details.controller';
import { listProjects } from './list-projects.controller';
import { updateProject } from './update-project.controller';

export const projectsRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(createProject);
  app.register(auth).register(getProjectDetails);
  app.register(auth).register(listProjects);
  app.register(auth).register(updateProject);
  app.register(auth).register(deleteProject);
};
