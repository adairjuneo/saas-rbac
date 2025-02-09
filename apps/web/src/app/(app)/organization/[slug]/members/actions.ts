'use server';

import { cookies } from 'next/headers';

import { listInvitesMembers } from '@/http/invites/list-invites';
import { listMembers } from '@/http/members/list-members';
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
