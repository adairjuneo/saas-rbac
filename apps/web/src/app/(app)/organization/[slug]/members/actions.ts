'use server';

import { HTTPError } from 'ky';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { listInvitesMembers } from '@/http/invites/list-invites';
import { listMembers } from '@/http/members/list-members';
import { removeMember } from '@/http/members/remove-member';
import { getOrganizationDetails } from '@/http/organizations/get-organization-details';

export const getListOfMembers = async () => {
  const cookiesStore = await cookies();
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  try {
    const { content } = await listMembers({ orgSlug: orgSlug! });
    return content;
  } catch (error) {
    console.error(error);
  }
};

export const getCurentOrganization = async () => {
  const cookiesStore = await cookies();
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  try {
    const { content } = await getOrganizationDetails({ orgSlug: orgSlug! });
    return content;
  } catch (error) {
    console.error(error);
  }
};

export const getListInvitesNewMembers = async () => {
  const cookiesStore = await cookies();
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  try {
    const { content } = await listInvitesMembers({ orgSlug: orgSlug! });
    return content;
  } catch (error) {
    console.error(error);
  }
};

const removeMemberSchema = z.object({
  memberId: z.string().min(1, { message: 'Field is required.' }),
});

export const removeMemberOfOrganization = async (data: FormData) => {
  const cookiesStore = await cookies();
  const result = removeMemberSchema.safeParse(Object.fromEntries(data));
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  if (!orgSlug) {
    return {
      success: false,
      message: 'Need to provide the organization slug to remove the member.',
      errors: null,
    };
  }

  if (!result.data?.memberId) {
    return {
      success: false,
      message: 'Need to provide the member id to remove the member.',
      errors: null,
    };
  }

  const { memberId } = result.data;

  try {
    await removeMember({ orgSlug, memberId });
    revalidateTag(String(orgSlug).concat('/members'));
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
