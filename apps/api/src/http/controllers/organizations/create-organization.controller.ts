import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaCreateOrganizationUseCase } from '@/use-cases/create-organization.usecase';

export const createOrganization = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-organization',
    {
      schema: {
        tags: ['organizations'],
        summary: 'Create a new organization',
        body: z.object({
          name: z.string(),
          domain: z.string(),
          avatarUrl: z.string().nullable().optional(),
          shouldAttachUsersByDomain: z.boolean().nullable(),
        }),
        response: {
          201: z.object({
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
      const userId = await request.getCurrentUserId();
      const { name, domain, avatarUrl, shouldAttachUsersByDomain } =
        request.body;

      const createOrganization = makeWithPrismaCreateOrganizationUseCase();

      const { organization } = await createOrganization.execute({
        ownerId: userId,
        name,
        domain,
        avatarUrl: avatarUrl ?? null,
        shouldAttachUsersByDomain: shouldAttachUsersByDomain ?? false,
      });

      reply.status(201).send({ content: organization });
    }
  );
};
