import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaRemoveMemberOfOrganizationUseCase } from '@/use-cases/remove-member-of-organization.usecase';

export const removeMemberOfOrganization = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:slug/remover-member/:memberId',
    {
      schema: {
        tags: ['members'],
        summary: 'Remove a existent member of organization',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
          memberId: z.string({ description: 'Member Id' }),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug, memberId } = request.params;
      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('delete', 'User')) {
        throw new UnauthorizedError(
          "You're not allowed to remove this member of organization."
        );
      }

      const deleteMember = makeWithPrismaRemoveMemberOfOrganizationUseCase();

      await deleteMember.execute({ memberId, organizationId: organization.id });

      reply.status(204).send();
    }
  );
};
