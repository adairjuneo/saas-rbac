import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaGetUserProfileUseCase } from '@/use-cases/get-user-profile.usecase';

export const getUserProfile = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['user'],
        summary: 'Get a user profile',
        response: {
          200: z.object({
            content: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string(),
              avatarUrl: z.string().nullable(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { user } = request;
        const getUserProfile = makeWithPrismaGetUserProfileUseCase();

        const profile = await getUserProfile.execute({ id: user.sub });

        reply.status(200).send({
          content: {
            id: profile.user.id,
            name: profile.user.name,
            email: profile.user.email,
            avatarUrl: profile.user.avatarUrl,
          },
        });
      } catch (err) {
        if (err) {
          return reply
            .status(400)
            .send({ message: 'Erro to get user session.' });
        }

        throw err;
      }
    }
  );
};
