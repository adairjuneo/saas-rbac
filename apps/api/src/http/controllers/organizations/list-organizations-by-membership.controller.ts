import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const listOrganizationsByMembership = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/list-organizations',
    {
      schema: {
        tags: ['organizations'],
        summary: 'List all organizations of user have a membership',
        response: {
          200: z.object({
            content: z.array(
              z.object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                avatarUrl: z.string().nullable(),
                role: z.string().optional(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId();

      const organizations = await prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
          members: {
            select: {
              role: true,
            },
            where: {
              userId,
            },
          },
        },
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
      });

      const organizationsWithUserRole = organizations.map(
        ({ members, ...organization }) => {
          return {
            ...organization,
            role: members[0]?.role,
          };
        }
      );

      reply.status(200).send({ content: organizationsWithUserRole });
    }
  );
};
