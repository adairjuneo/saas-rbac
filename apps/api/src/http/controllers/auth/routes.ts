import type { FastifyInstance } from 'fastify';

import { createUser } from './create-user.controller';
import { createUserSession } from './create-user-session.controller';
import { createUserSessionWithGithub } from './create-user-session-github.controller';
import { requestRecoveryPassword } from './request-recovery-password.controller';
import { resetPassword } from './reset-password.controller';

export const authRoutes = async (app: FastifyInstance) => {
  app.register(createUser);
  app.register(requestRecoveryPassword);
  app.register(resetPassword);
  app.register(createUserSession);
  app.register(createUserSessionWithGithub);
};
