import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaGetProjectDetailsUseCase } from '@/use-cases/get-project-details.usecase';

export const getProjectDetails = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:slug/details-project/:projectSlug',
    {
      schema: {
        tags: ['projects'],
        summary: 'Get a project details',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
          projectSlug: z.string({ description: 'Project slug' }),
        }),
        response: {
          200: z.object({
            content: z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
              description: z.string(),
              avatarUrl: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              ownerId: z.string(),
              organizationId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug, projectSlug } = request.params;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('get', 'Project')) {
        throw new UnauthorizedError(
          "You're not allowed to get details of this project."
        );
      }

      const findProject = makeWithPrismaGetProjectDetailsUseCase();

      const { project } = await findProject.execute({
        projectId: null,
        projectSlug,
        organizationId: organization.id,
      });

      reply.status(200).send({ content: project });
    }
  );
};
