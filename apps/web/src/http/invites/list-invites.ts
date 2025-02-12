import type { Role } from '@saas-rbac/auth';

import { api } from '../api-client';

interface ListInvitesMembersRequest {
  orgSlug: string;
}

interface ListInvitesMembersResponse {
  content: {
    id: string;
    role: Role;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    organization?: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
    author?: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
  }[];
}

export const listInvitesMembers = async ({
  orgSlug,
}: ListInvitesMembersRequest) => {
  const url = 'invites/'.concat(orgSlug).concat('/list-invites');
  const result = await api
    .get(url, { next: { tags: [String(orgSlug).concat('/list-invites')] } })
    .json<ListInvitesMembersResponse>();

  return result;
};

export type { ListInvitesMembersRequest, ListInvitesMembersResponse };
