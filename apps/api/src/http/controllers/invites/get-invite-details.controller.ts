import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { inviteSchema } from '@/repositories/interfaces/invites.interface';
import { makeWithPrismaGetDetailsInviteUseCase } from '@/use-cases/get-details-invite.usecase';

export const getInviteDetails = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/details-invite/:inviteId',
    {
      schema: {
        tags: ['invites'],
        summary: 'Get a invite details',
        params: z.object({
          inviteId: z.string({ description: 'Invite Id' }),
        }),
        response: {
          200: z.object({
            content: inviteSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const { inviteId } = request.params;

      const getDetailsInvite = makeWithPrismaGetDetailsInviteUseCase();

      const { invite } = await getDetailsInvite.execute({
        inviteId,
      });

      reply.status(200).send({ content: invite });
    }
  );
};
