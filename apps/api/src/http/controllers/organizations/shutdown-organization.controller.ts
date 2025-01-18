import { organizationSchema } from '@saas-rbac/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaShutdownOrganizationUseCase } from '@/use-cases/shutdown-organization.usecase';

export const shutdownOrganization = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/shutdown-organization/:slug',
    {
      schema: {
        tags: ['organizations'],
        summary: 'Update a existent organization',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          204: z.object({
            content: z.object({
              organizationHasBeenOff: z.boolean(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const authOrganization = organizationSchema.parse(organization);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('delete', authOrganization)) {
        throw new UnauthorizedError(
          "You're not allowed to shutdown this organization."
        );
      }

      const shutdownOrganization = makeWithPrismaShutdownOrganizationUseCase();

      const { organizationHasBeenOff } = await shutdownOrganization.execute({
        organizationId: organization.id,
      });

      reply.status(204).send({ content: { organizationHasBeenOff } });
    }
  );
};
