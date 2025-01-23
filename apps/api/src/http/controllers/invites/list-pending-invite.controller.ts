import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { inviteSchema } from '@/repositories/interfaces/invites.interface';
import { makeWithPrismaListPendingInvitesUseCase } from '@/use-cases/list-pending-invites.usecase';

export const listPendingInvites = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/list-pending-invites',
    {
      schema: {
        tags: ['invites'],
        summary: 'List all invites pending for user accept',
        response: {
          200: z.object({
            content: z.array(inviteSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId();

      const listPendingInvites = makeWithPrismaListPendingInvitesUseCase();

      const { invites } = await listPendingInvites.execute({ userId });

      reply.status(200).send({ content: invites });
    }
  );
};
