import type { Role } from '@saas-rbac/auth';

import { api } from '../api-client';

interface ListMembersRequest {
  orgSlug: string;
}

interface ListMembersResponse {
  content: {
    id: string;
    role: Role;
    user: {
      id: string;
      name: string | null;
      email: string;
      avatarUrl: string | null;
    };
  }[];
}

export const listMembers = async ({ orgSlug }: ListMembersRequest) => {
  const url = 'members/'.concat(orgSlug).concat('/list-members');
  const result = await api
    .get(url, { next: { tags: [String(orgSlug).concat('/members')] } })
    .json<ListMembersResponse>();

  return result;
};

export type { ListMembersRequest, ListMembersResponse };
