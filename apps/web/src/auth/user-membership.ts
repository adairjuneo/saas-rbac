import { defineAbilityFor } from '@saas-rbac/auth';
import { cookies } from 'next/headers';

import { getUserMembership } from '@/http/organizations/get-user-membership';

export const getCurrentUserMembership = async () => {
  const cookiesStore = await cookies();

  const orgSlug = cookiesStore.get('org')?.value ?? null;

  if (!orgSlug) {
    return null;
  }

  const { content } = await getUserMembership({ orgSlug });

  return content;
};

export const getUserAbility = async () => {
  const userMembership = await getCurrentUserMembership();

  if (!userMembership) {
    return null;
  }

  const ability = defineAbilityFor({
    id: userMembership.userId,
    role: userMembership.role,
  });

  return ability;
};
