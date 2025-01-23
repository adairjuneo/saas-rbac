import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { inviteSchema } from '@/repositories/interfaces/invites.interface';
import { makeWithPrismaListInvitesOfOrganizationUseCase } from '@/use-cases/list-invites-of-organization.usecase';

export const listInvitesOfOrganization = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:slug/list-invites',
    {
      schema: {
        tags: ['invites'],
        summary: 'List all invites of organization',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
        }),
        response: {
          200: z.object({
            content: z.array(inviteSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('get', 'invite')) {
        throw new UnauthorizedError(
          "You're not allowed to get a list of invites this organization."
        );
      }

      const listInvitesOfOrganization =
        makeWithPrismaListInvitesOfOrganizationUseCase();

      const { invites } = await listInvitesOfOrganization.execute({
        organizationId: organization.id,
      });

      reply.status(200).send({ content: invites });
    }
  );
};
