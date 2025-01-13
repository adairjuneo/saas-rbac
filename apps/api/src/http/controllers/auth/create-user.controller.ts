import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaCreateUserUseCase } from '@/use-cases/create-user.usecase';

export const createUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-user',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            content: z.object({
              id: z.string(),
            }),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      try {
        const createUser = makeWithPrismaCreateUserUseCase();

        const { user } = await createUser.execute({ name, email, password });

        reply.status(201).send({ content: { id: user.id } });
      } catch (err) {
        if (err) {
          return reply.status(409).send({ message: 'Erro to create a user.' });
        }

        throw err;
      }
    }
  );
};
