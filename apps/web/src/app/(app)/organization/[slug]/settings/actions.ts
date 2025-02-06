'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';

import { deleteOrganization } from '@/http/organizations/shutdown-organization';

export const shutdownOrganization = async (__: FormData) => {
  const cookiesStore = await cookies();

  const orgSlug = cookiesStore.get('org')?.value ?? null;

  if (!orgSlug) {
    return {
      success: false,
      message: 'Need to provide the organization slug to save project.',
      errors: null,
    };
  }

  try {
    await deleteOrganization({ orgSlug });
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
