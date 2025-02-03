'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { createProject } from '@/http/projects/create-project';

const projectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Field is required.' })
    .refine((value) => value.split(' ').length > 1, {
      message: 'Provide a project full name.',
    }),
  description: z
    .string()
    .min(1, { message: 'Field is required.' })
    .max(256, { message: 'Max of characters is 256.' }),
});

export const createNewProject = async (data: FormData) => {
  const result = projectSchema.safeParse(Object.fromEntries(data));
  const cookiesStore = await cookies();

  const orgSlug = cookiesStore.get('org')?.value ?? null;

  if (!orgSlug) {
    return {
      success: false,
      message: 'Need to provide the organization slug to save project.',
      errors: null,
    };
  }

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { name, description } = result.data;

  try {
    await createProject({
      orgSlug,
      name,
      avatarUrl: null,
      description,
    });
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
