'use server';

import { HTTPError } from 'ky';
import { z } from 'zod';

import { signInWithPassword } from '@/http/auth/sign-in-with-password';

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Provide a valid e-mail address.' })
    .min(1, { message: 'Field is required.' }),
  password: z.string().min(1, { message: 'Field is required.' }),
});

export const signInWithEmailAndPassword = async (
  _: unknown,
  data: FormData
) => {
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { sucess: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { content } = await signInWithPassword({ email, password });

    return { sucess: true, message: content, errors: null };
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

      return { sucess: false, message, errors: null };
    }

    console.error(error);

    return {
      sucess: false,
      message: 'Unexpected error, try in a few minutes.',
      errors: null,
    };
  }
};
