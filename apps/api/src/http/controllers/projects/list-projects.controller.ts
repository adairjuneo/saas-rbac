import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { projectsSchema } from '@/repositories/interfaces/projects.interface';
import { makeWithPrismaListProjectsUseCase } from '@/use-cases/list-projects.usecase';

export const listProjects = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:slug/list-projects',
    {
      schema: {
        tags: ['projects'],
        summary: 'Get a list of projects',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
        }),
        response: {
          200: z.object({
            content: z.array(projectsSchema),
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

      if (cannot('get', 'Project')) {
        throw new UnauthorizedError(
          "You're not allowed to get a list of projects."
        );
      }

      const listProjects = makeWithPrismaListProjectsUseCase();

      const { projects } = await listProjects.execute({
        organizationId: organization.id,
      });

      reply.status(200).send({ content: projects });
    }
  );
};
