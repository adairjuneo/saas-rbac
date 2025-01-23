import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaAcceptInviteUseCase } from '@/use-cases/accept-invite.usecase';

export const acceptInvite = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/accept-invite/:inviteId',
    {
      schema: {
        tags: ['invites'],
        summary: 'Accept invite to enter a organization',
        params: z.object({
          inviteId: z.string({ description: 'Invite Id' }),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId();
      const { inviteId } = request.params;

      const acceptInvite = makeWithPrismaAcceptInviteUseCase();

      await acceptInvite.execute({ inviteId, userId });

      reply.status(204).send();
    }
  );
};
