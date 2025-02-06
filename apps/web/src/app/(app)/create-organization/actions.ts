'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { createOrganization } from '@/http/organizations/create-organization';
import { updateOrganization } from '@/http/organizations/update-organization';

const organizationSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Field is required.' })
    .refine((value) => value.split(' ').length > 1, {
      message: 'Provide a organization full name.',
    }),
  domain: z
    .string()
    .min(1, { message: 'Field is required.' })
    .refine(
      (value) => {
        if (value) {
          return /^[a-zA-Z0-9*-]+\.[a-zA-Z]{2,}$/.test(value);
        }
      },
      { message: 'Provida a valid domain for your organization.' }
    ),
  shouldAttachUsersByDomain: z
    .union([z.literal('on'), z.literal('off'), z.boolean()])
    .transform((value) => value === true || value === 'on')
    .default(false),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;

export const createNewOrganization = async (data: FormData) => {
  const result = organizationSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data;

  try {
    await createOrganization({
      name,
      domain,
      avatarUrl: null,
      shouldAttachUsersByDomain,
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

export const updateCurrentOrganization = async (data: FormData) => {
  const result = organizationSchema.safeParse(Object.fromEntries(data));
  const cookiesStore = await cookies();
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  if (!orgSlug) {
    return {
      success: false,
      message: 'Need to provide the organization slug to update organization.',
      errors: null,
    };
  }

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data;

  try {
    await updateOrganization({
      orgSlug,
      name,
      domain,
      avatarUrl: null,
      shouldAttachUsersByDomain,
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
