import { projectSchema } from '@saas-rbac/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaDeleteProjectUseCase } from '@/use-cases/delete-project.usecase';
import { makeWithPrismaGetProjectDetailsUseCase } from '@/use-cases/get-project-details.usecase';

export const deleteProject = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:slug/delete-project/:projectId',
    {
      schema: {
        tags: ['projects'],
        summary: 'Delete a project',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
          projectId: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug, projectId } = request.params;

      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const findProject = makeWithPrismaGetProjectDetailsUseCase();
      const { project } = await findProject.execute({
        projectId,
        organizationId: organization.id,
        projectSlug: null,
      });

      const { cannot } = createUserPermissions(userId, membership.role);
      const authProject = projectSchema.parse(project);

      if (cannot('delete', authProject)) {
        throw new UnauthorizedError(
          "You're not allowed to delete this project."
        );
      }

      const deleteProject = makeWithPrismaDeleteProjectUseCase();

      await deleteProject.execute({
        projectId,
        organizationId: organization.id,
      });

      reply.status(204).send();
    }
  );
};
