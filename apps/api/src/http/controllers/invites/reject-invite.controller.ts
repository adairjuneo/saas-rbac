import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaRejectInviteUseCase } from '@/use-cases/reject-invite.usecase';

export const rejectInvite = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/reject-invite/:inviteId',
    {
      schema: {
        tags: ['invites'],
        summary: 'Reject invite to enter a organization',
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

      const rejectInvite = makeWithPrismaRejectInviteUseCase();

      await rejectInvite.execute({ inviteId, userId });

      reply.status(204).send();
    }
  );
};
