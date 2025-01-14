import type { FastifyInstance } from 'fastify';

import { createUser } from './create-user.controller';
import { createUserSession } from './create-user-session.controller';
import { requestRecoveryPassword } from './request-recovery-password.controller';
import { resetPassword } from './reset-password.controller';

export const authRoutes = async (app: FastifyInstance) => {
  app.register(createUser);
  app.register(createUserSession);
  app.register(requestRecoveryPassword);
  app.register(resetPassword);
};
