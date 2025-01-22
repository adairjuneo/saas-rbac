import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import {
  createUpdateMembersSchema,
  membersSchema,
} from '@/repositories/interfaces/members.interface';
import { makeWithPrismaUpdateMemberUseCase } from '@/use-cases/update-member.usecase';

export const updateMember = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:slug/update-member/:memberId',
    {
      schema: {
        tags: ['members'],
        summary: 'Update a existent member in organization',
        body: createUpdateMembersSchema,
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
          memberId: z.string({ description: 'Member Id' }),
        }),
        response: {
          204: z.object({
            content: membersSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug, memberId } = request.params;
      const { ...data } = request.body;
      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('update', 'User')) {
        throw new UnauthorizedError(
          "You're not allowed to update this member."
        );
      }

      const updateMember = makeWithPrismaUpdateMemberUseCase();

      const { member } = await updateMember.execute({
        memberId,
        organizationId: organization.id,
        data,
      });

      reply.status(204).send({ content: member });
    }
  );
};
