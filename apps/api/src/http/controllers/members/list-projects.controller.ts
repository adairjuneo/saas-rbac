import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { membersSchema } from '@/repositories/interfaces/members.interface';
import { makeWithPrismaListMembersUseCase } from '@/use-cases/list-members.usecase';

export const listMembers = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:slug/list-members',
    {
      schema: {
        tags: ['members'],
        summary: 'Get a list of members',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
        }),
        response: {
          200: z.object({
            content: z.array(membersSchema),
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

      if (cannot('get', 'User')) {
        throw new UnauthorizedError(
          "You're not allowed to get a list of members in this organization."
        );
      }

      const listMembers = makeWithPrismaListMembersUseCase();

      const { members } = await listMembers.execute({
        organizationId: organization.id,
      });

      reply.status(200).send({ content: members });
    }
  );
};
