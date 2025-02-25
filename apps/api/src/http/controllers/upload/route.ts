import type { FastifyInstance } from 'fastify';

import { auth } from '@/http/middlewares/auth';

import { updateImageProfile } from './update-image-profile';

export const uploadRoutes = async (app: FastifyInstance) => {
  app.register(auth).register(updateImageProfile);
};
