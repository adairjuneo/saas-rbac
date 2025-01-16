import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const getMembership = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:slug/membership',
    {
      schema: {
        tags: ['organizations'],
        summary: 'Get a user membership on organization',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            content: z.object({
              id: z.string(),
              role: z.string(),
              organizationId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;
      const { membership } = await request.getCurrentMembership(slug);

      const { id, role, organizationId } = membership;

      reply.status(200).send({
        content: {
          id,
          role,
          organizationId,
        },
      });
    }
  );
};
