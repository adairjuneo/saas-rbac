import fastifyCors from '@fastify/cors';
import chalk from 'chalk';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from '@/env';

import { appRoutes } from './http/routes';

const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);
app.register(appRoutes, { prefix: '/api/v1' });

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.info(chalk.greenBright('🔥 HTTP Server Running!'));
  });
