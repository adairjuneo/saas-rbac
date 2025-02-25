import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { env } from './env';

type GetUrlAccessType = {
  fileKey: string;
};

export const r2 = new S3Client({
  region: 'auto',
  endpoint: env.R2_BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_BUCKET_ACCESS_KEY,
    secretAccessKey: env.R2_BUCKET_SECRET_KEY,
  },
});

export const getSignedUrlAccess = async ({ fileKey }: GetUrlAccessType) => {
  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    }),
    { expiresIn: 60 * 60 * 1 } // 1 hour to expire (3600 seconds)
  );

  return signedUrl;
};
