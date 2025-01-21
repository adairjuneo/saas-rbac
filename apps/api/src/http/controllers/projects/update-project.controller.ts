import { projectSchema } from '@saas-rbac/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaGetProjectDetailsUseCase } from '@/use-cases/get-project-details.usecase';
import { makeWithPrismaUpdateProjectUseCase } from '@/use-cases/update-project.usecase';

export const updateProject = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:slug/update-project/:projectSlug',
    {
      schema: {
        tags: ['projects'],
        summary: 'Update a  existent project',
        body: z.object({
          name: z.string(),
          description: z.string(),
          avatarUrl: z.string().url().optional(),
        }),
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
          projectSlug: z.string({ description: 'Project slug' }),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug, projectSlug } = request.params;
      const { name, description, avatarUrl } = request.body;
      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const findProject = makeWithPrismaGetProjectDetailsUseCase();
      const { project } = await findProject.execute({
        projectId: null,
        organizationId: organization.id,
        projectSlug,
      });

      const { cannot } = createUserPermissions(userId, membership.role);
      const authProject = projectSchema.parse(project);

      if (cannot('update', authProject)) {
        throw new UnauthorizedError(
          "You're not allowed to update this project."
        );
      }

      const updateProject = makeWithPrismaUpdateProjectUseCase();

      await updateProject.execute({
        name,
        description,
        avatarUrl: avatarUrl ?? null,
        projectId: project.id,
      });

      reply.status(204).send();
    }
  );
};
