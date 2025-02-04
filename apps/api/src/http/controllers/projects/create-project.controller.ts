import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaCreateProjectUseCase } from '@/use-cases/create-project.usecase';

export const createProject = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/:slug/create-project',
    {
      schema: {
        tags: ['projects'],
        summary: 'Create a new project',
        body: z.object({
          name: z.string(),
          description: z.string(),
          avatarUrl: z.string().url().optional().nullable(),
        }),
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
        }),
        response: {
          201: z.object({
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
      const { slug } = request.params;
      const { name, description, avatarUrl } = request.body;
      const userId = await request.getCurrentUserId();
      const { membership, organization } =
        await request.getCurrentMembership(slug);

      const { cannot } = createUserPermissions(userId, membership.role);

      if (cannot('create', 'Project')) {
        throw new UnauthorizedError(
          "You're not allowed to create new projects on this organization."
        );
      }

      const createProject = makeWithPrismaCreateProjectUseCase();

      const { project } = await createProject.execute({
        name,
        description,
        avatarUrl: avatarUrl ?? null,
        ownerId: userId,
        organizationId: organization.id,
      });

      reply.status(201).send({ content: project });
    }
  );
};
