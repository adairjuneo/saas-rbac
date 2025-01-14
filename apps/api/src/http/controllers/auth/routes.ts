import type { FastifyInstance } from 'fastify';

import { createUser } from './create-user.controller';
import { createUserSession } from './create-user-session.controller';
import { requestRecoveryPassword } from './request-recovery-password.controller';

export const authRoutes = async (app: FastifyInstance) => {
  app.register(createUser);
  app.register(createUserSession);
  app.register(requestRecoveryPassword);

  // CREATE ROUTE FOR GET RECOVERY FOR RESET PASSWORD;

  // CREATE ROUTE FOR POST A NEW PASSWORD BY CODE REQUESTED;
};
