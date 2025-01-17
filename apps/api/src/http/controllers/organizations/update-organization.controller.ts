import { organizationSchema } from '@saas-rbac/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaUpdateOrganizationUseCase } from '@/use-cases/update-organization.usecase';

export const updateOrganization = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/update-organization/:slug',
    {
      schema: {
        tags: ['organizations'],
        summary: 'Update a existent organization',
        body: z.object({
          name: z.string().optional(),
          domain: z.string().optional(),
          shouldAttachUsersByDomain: z.boolean().optional(),
        }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          204: z.object({
            content: z.object({
              id: z.string(),
              name: z.string(),
              domain: z.string().nullable(),
              shouldAttachUsersByDomain: z.boolean().nullable(),
              avatarUrl: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              slug: z.string(),
              ownerId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;
      const { name, domain, shouldAttachUsersByDomain } = request.body;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const authOrganization = organizationSchema.parse(organization);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('update', authOrganization)) {
        throw new UnauthorizedError(
          "You're not allowed to update this organization."
        );
      }

      const updateOrganization = makeWithPrismaUpdateOrganizationUseCase();

      const { organization: organizationUpdated } =
        await updateOrganization.execute({
          organizationId: organization.id,
          name,
          domain,
          shouldAttachUsersByDomain,
        });

      reply.status(204).send({ content: organizationUpdated });
    }
  );
};
