import { organizationSchema } from '@saas-rbac/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { BadRequestError } from '@/errors/bad-request.error';
import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { prisma } from '@/lib/prisma';

export const transferOwnerOfOrganization = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/update-organization/:slug/ownership',
    {
      schema: {
        tags: ['organizations'],
        summary: 'Transfer ownersip organization to another member user.',
        body: z.object({
          userIdToTransferOwnership: z.string(),
        }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;
      const { userIdToTransferOwnership } = request.body;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const authOrganization = organizationSchema.parse(organization);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('transfer_ownership', authOrganization)) {
        throw new UnauthorizedError(
          "You're not allowed to transfer ownership of this organization."
        );
      }

      const memberThisOrganization = await prisma.member.findUnique({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: userIdToTransferOwnership,
          },
        },
      });

      if (!memberThisOrganization) {
        throw new BadRequestError(
          'That user provide is not a member of this organization.'
        );
      }

      await prisma.$transaction([
        prisma.member.update({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: userIdToTransferOwnership,
            },
          },
          data: {
            role: 'ADMIN',
          },
        }),
        prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            ownerId: userIdToTransferOwnership,
          },
        }),
      ]);

      reply.status(204).send();
    }
  );
};
