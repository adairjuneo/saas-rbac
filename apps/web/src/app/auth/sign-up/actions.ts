'use server';

import { HTTPError } from 'ky';
import { z } from 'zod';

import { signUpUser } from '@/http/auth/sign-up-user';

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Field is required.' })
      .refine((value) => value.split(' ').length > 1, {
        message: 'Provide your full name.',
      }),
    email: z
      .string()
      .min(1, { message: 'Field is required.' })
      .email({ message: 'Provide a valid e-mail address.' }),
    password: z.string().min(6, { message: 'Minimum 6 characters.' }),
    password_confirmation: z
      .string()
      .min(6, { message: 'Minimum 6 characters.' }),
  })
  .refine(
    (fieldsData) => fieldsData.password === fieldsData.password_confirmation,
    {
      message: 'Passwords must be match.',
      path: ['password_confirmation'],
    }
  );

export const signUpNewUser = async (data: FormData) => {
  const result = signUpSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { name, email, password } = result.data;

  try {
    await signUpUser({ name, email, password });
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
