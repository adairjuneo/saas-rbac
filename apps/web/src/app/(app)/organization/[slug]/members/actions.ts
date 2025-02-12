'use server';

import { HTTPError } from 'ky';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { listInvitesMembers } from '@/http/invites/list-invites';
import { revokeInvite } from '@/http/invites/revoke-invite';
import { listMembers } from '@/http/members/list-members';
import { removeMember } from '@/http/members/remove-member';
import { updateMember } from '@/http/members/update-member';
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

const updateRoleMemberSchema = z.object({
  memberId: z.string().min(1, { message: 'Field is required.' }),
  role: z.string().min(1, { message: 'Field is required.' }),
});

export const updateRoleMemberInOrganization = async (data: FormData) => {
  const cookiesStore = await cookies();
  const result = updateRoleMemberSchema.safeParse(Object.fromEntries(data));
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  if (!orgSlug) {
    return {
      success: false,
      message:
        'Need to provide the organization slug to update the member Role.',
      errors: null,
    };
  }

  if (!result.data?.memberId || !result.data?.role) {
    return {
      success: false,
      message:
        'Need to provide the member id and role to update the member Role.',
      errors: null,
    };
  }

  const { memberId, role } = result.data;

  try {
    await updateMember({ orgSlug, memberId, role });
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

const revokeInviteSchema = z.object({
  inviteId: z.string().min(1, { message: 'Field is required.' }),
});

export const revokeInviteForThisOrganization = async (data: FormData) => {
  const cookiesStore = await cookies();
  const result = revokeInviteSchema.safeParse(Object.fromEntries(data));
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  if (!orgSlug) {
    return {
      success: false,
      message: 'Need to provide the organization slug to revoke the invite.',
      errors: null,
    };
  }

  if (!result.data?.inviteId) {
    return {
      success: false,
      message: 'Need to provide the invite id to revoke the invite.',
      errors: null,
    };
  }

  const { inviteId } = result.data;

  try {
    await revokeInvite({ orgSlug, inviteId });
    revalidateTag(String(orgSlug).concat('/list-invites'));
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
