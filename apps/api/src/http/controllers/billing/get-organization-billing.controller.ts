import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '@/errors/unauthorized.error';
import { createUserPermissions } from '@/lib/create-user-permissions';
import { makeWithPrismaGetOrganizationBillingUseCase } from '@/use-cases/get-organization-billing.usecase';

export const getOrganizationBilling = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:slug/details-billing',
    {
      schema: {
        tags: ['billing'],
        summary: 'Get a details of billing for currente organization',
        params: z.object({
          slug: z.string({ description: 'Organization slug' }),
        }),
        response: {
          200: z.object({
            content: z.object({
              seats: z.object({
                amount: z.number(),
                unit: z.number(),
                price: z.number(),
              }),
              projects: z.object({
                amount: z.number(),
                unit: z.number(),
                price: z.number(),
              }),
              total: z.number(),
            }),
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

      if (cannot('get', 'Billing')) {
        throw new UnauthorizedError(
          "You're not allowed to get billing details from this organization."
        );
      }

      const getBilling = makeWithPrismaGetOrganizationBillingUseCase();

      const { billing } = await getBilling.execute({
        organizationId: organization.id,
      });

      reply.status(201).send({ content: billing });
    }
  );
};
