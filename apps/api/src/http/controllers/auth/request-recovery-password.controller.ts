import chalk from 'chalk';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { sendMail } from '@/lib/email';
import { makeWithPrismaRequestPasswordRecoveryUseCase } from '@/use-cases/request-password-recovery.usecase';

export const requestRecoveryPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/recovery-password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request a recovery password for user',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const requestPasswordRecovery =
        makeWithPrismaRequestPasswordRecoveryUseCase();

      const { token } = await requestPasswordRecovery.execute({ email });

      if (token) {
        const { error } = await sendMail.emails.send({
          from: 'Dev Juneo <noreply@mail.dev-juneo.com>',
          to: ['adair_juneo@hotmail.com'],
          subject: 'Password Recovery Request - SASS RBAC',
          html: String('<h3>Code for reset password</h3><br/><p>Code: <strong>')
            .concat(token.id)
            .concat('</strong></p>'),
        });

        if (error) {
          console.error(chalk.redBright(error.name));
          console.error(chalk.redBright(error.message));
        }
      }

      reply.status(204).send();
    }
  );
};
