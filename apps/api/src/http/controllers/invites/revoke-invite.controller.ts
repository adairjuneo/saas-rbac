import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaRevokeInviteUseCase } from '@/use-cases/revoke-invite.usecase';

export const revokeInvite = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/:slug/revoke-invite/:inviteId',
    {
      schema: {
        tags: ['invites'],
        summary: 'Revoke a invite created',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
          inviteId: z.string({ description: 'Invite Id' }),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug, inviteId } = request.params;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('delete', 'invite')) {
        throw new UnauthorizedError("You're not allowed to revoke invites.");
      }

      const revokeInvite = makeWithPrismaRevokeInviteUseCase();

      await revokeInvite.execute({ inviteId, organizationId: organization.id });

      reply.status(204).send();
    }
  );
};
