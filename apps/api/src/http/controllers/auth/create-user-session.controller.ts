import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaAuthenticateWithPasswordUseCase } from '@/use-cases/autheticate-with-password.usecase';

export const createUserSession = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-session-password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new user session with password',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            content: z.object({
              token: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const createUser = makeWithPrismaAuthenticateWithPasswordUseCase();

      const { user } = await createUser.execute({ email, password });

      const tokenJwt = await reply.jwtSign({}, { sign: { sub: user.id } });

      reply.status(200).send({ content: { token: tokenJwt } });
    }
  );
};
