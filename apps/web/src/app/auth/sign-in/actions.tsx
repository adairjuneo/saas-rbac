'use server';

import { HTTPError } from 'ky';
import { z } from 'zod';

import { signInWithPassword } from '@/http/auth/sign-in-with-password';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Field is required.' })
    .email({ message: 'Provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Field is required.' }),
});

export const signInWithEmailAndPassword = async (data: FormData) => {
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { content } = await signInWithPassword({ email, password });

    return { success: true, message: content, errors: null };
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
};
