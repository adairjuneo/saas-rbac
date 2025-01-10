import type { FastifyInstance } from 'fastify';

export const usersRoutes = async (app: FastifyInstance) => {
  app.get('/', (_, reply) => {
    reply.status(200).send('Users routes.');
  });
};
