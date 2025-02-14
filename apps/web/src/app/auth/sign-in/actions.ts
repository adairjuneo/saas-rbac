'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { signInWithPassword } from '@/http/auth/sign-in-with-password';
import { acceptInvite } from '@/http/invites/accept-invite';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Field is required.' })
    .email({ message: 'Provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Field is required.' }),
});

export const signInWithEmailAndPassword = async (data: FormData) => {
  const result = signInSchema.safeParse(Object.fromEntries(data));
  const cookiesStore = await cookies();

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { content } = await signInWithPassword({ email, password });

    (await cookies()).set('token', content.token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 3, // 3 Days
    });

    const inviteId = cookiesStore.get('inviteId')?.value;

    if (inviteId) {
      await acceptInvite({ inviteId });
      cookiesStore.delete('inviteId');
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

      return { success: false, message, errors: null };
    }

    console.error(error);

    return {
      success: false,
      message: 'Unexpected error, try in a few minutes.',
      errors: null,
    };
  }

  return { success: true, message: null, errors: null };
};
