import { S3Client } from '@aws-sdk/client-s3';

import { env } from './env';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: env.R2_BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_BUCKET_ACCESS_KEY,
    secretAccessKey: env.R2_BUCKET_SECRET_KEY,
  },
});
