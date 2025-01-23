import { roleSchema } from '@saas-rbac/auth/src/roles';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { BadRequestError } from '@/errors/bad-request.error';
import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaCreateInviteUseCase } from '@/use-cases/create-invite.usecase';

export const createInvite = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/:slug/create-invite',
    {
      schema: {
        tags: ['invites'],
        summary: 'Create a new invite',
        body: z.object({
          email: z.string(),
          role: roleSchema,
        }),
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
        }),
        response: {
          201: z.object({
            content: z.object({
              inviteId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, role } = request.body;
      const { slug } = request.params;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('create', 'invite')) {
        throw new UnauthorizedError("You're not allowed to create invites.");
      }

      const [, domain] = email.split('@');

      if (
        organization.shouldAttachUsersByDomain &&
        organization.domain === domain
      ) {
        throw new BadRequestError(
          'Users with '
            .concat(domain)
            .concat(
              ' domain will join this organization automatically on login.'
            )
        );
      }

      const createInvite = makeWithPrismaCreateInviteUseCase();

      const { invite } = await createInvite.execute({
        role,
        email,
        authorId: userId,
        organizationId: organization.id,
      });

      reply.status(201).send({ content: { inviteId: invite.id } });
    }
  );
};
