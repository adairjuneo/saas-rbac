import type { FastifyInstance } from 'fastify';

import { createUser } from './create-user.controller';
import { createUserSession } from './create-user-session.controller';

export const authRoutes = async (app: FastifyInstance) => {
  app.register(createUser);
  app.register(createUserSession);
};
