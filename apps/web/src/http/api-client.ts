import ky from 'ky';

import { getAuthToken } from '@/app/actions';

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const { token } = await getAuthToken();

        if (token) {
          request.headers.set('Authorization', String('Bearer ').concat(token));
        }
      },
    ],
  },
});
