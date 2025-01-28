import type { Role } from '@saas-rbac/auth';

import { api } from '../api-client';

interface GetUserMembershipRequest {
  orgSlug: string;
}

interface GetUserMembershipResponse {
  content: {
    id: string;
    role: Role;
    userId: string;
    organizationId: string;
  };
}

export const getUserMembership = async ({
  orgSlug,
}: GetUserMembershipRequest) => {
  const url = 'organizations/'.concat(orgSlug).concat('/membership');
  const result = await api.get(url).json<GetUserMembershipResponse>();

  return result;
};

export type { GetUserMembershipRequest, GetUserMembershipResponse };
