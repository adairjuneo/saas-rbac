import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaAuthenticateWithGitHubUseCase } from '@/use-cases/autheticate-with-github.usecase';

export const createUserSessionWithGithub = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-session-github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new user session with GitHub',
        body: z.object({
          code: z.string(),
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
      const { code } = request.body;

      const authenticateWithGitHub =
        makeWithPrismaAuthenticateWithGitHubUseCase();

      const { user } = await authenticateWithGitHub.execute({ code });

      const tokenJwt = await reply.jwtSign({}, { sign: { sub: user.id } });

      reply.status(200).send({ content: { token: tokenJwt } });
    }
  );
};
