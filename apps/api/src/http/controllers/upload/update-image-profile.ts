import { randomUUID } from 'node:crypto';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { BadRequestError } from '@/errors/bad-request.error';
import { env } from '@/lib/env';
import { getSignedUrlAccess, r2 } from '@/lib/r2';

const fileMimeTypeSchema = z.object({
  mimeType: z
    .string()
    .refine(
      (type) => ['image/png', 'image/jpeg', 'image/webp'].includes(type),
      {
        message: 'Image file type must be one of this PNG, JPEG or WEBP.',
      }
    ),
});

const fileMaxSizeSchema = z.object({
  maxSize: z
    .number()
    .max(1024 * 1024 * 5, { message: 'Image file must have a max size 5MB.' }),
});

export const updateImageProfile = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/update-image-profile',
    {
      schema: {
        tags: ['upload'],
        summary: 'Update a image profile current user.',
        response: {
          200: z.object({
            content: z.object({
              fileKey: z.string(),
              url: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const data = await request.file();
      const userId = await request.getCurrentUserId();

      if (!data) {
        throw new BadRequestError('Image file must be provide.');
      }

      fileMimeTypeSchema.parse({ mimeType: data.mimetype });

      const chunks: Buffer[] = [];

      for await (const chunk of data.file) {
        chunks.push(chunk);
      }

      const fileBuffer = Buffer.concat(chunks);
      const fileSize = fileBuffer.length;

      fileMaxSizeSchema.parse({ maxSize: fileSize });

      try {
        const fileKey = String(userId)
          .concat('/')
          .concat(randomUUID())
          .concat('-')
          .concat(data.filename);

        const uploadCommand = new PutObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: data.mimetype,
        });

        await r2.send(uploadCommand);

        const url = await getSignedUrlAccess({ fileKey });

        reply.status(200).send({ content: { fileKey, url } });
      } catch (error) {
        request.log.error(error);
        throw new BadRequestError(
          'Error to try upload this file image profile.'
        );
      }
    }
  );
};
