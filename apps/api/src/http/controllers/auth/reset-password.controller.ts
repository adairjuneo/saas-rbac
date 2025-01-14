import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaResetPasswordUseCase } from '@/use-cases/reset-password.usecase';

export const resetPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/reset-password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request a reset password for user by token',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body;

      const resetPassword = makeWithPrismaResetPasswordUseCase();

      await resetPassword.execute({ code, password });

      reply.status(204).send();
    }
  );
};
