import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const getOrganizationByMembership = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/get-details/:slug',
    {
      schema: {
        tags: ['organizations'],
        summary: 'Get details about organization by user membership',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            content: z.object({
              slug: z.string(),
              id: z.string(),
              name: z.string(),
              domain: z.string().nullable(),
              shouldAttachUsersByDomain: z.boolean(),
              avatarUrl: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              ownerId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;
      const { organization } = await request.getCurrentMembership(slug);

      reply.status(200).send({ content: organization });
    }
  );
};
