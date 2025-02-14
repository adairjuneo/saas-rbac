import type { Role } from '@saas-rbac/auth';

import { api } from '../api-client';

interface GetInviteRequest {
  inviteId: string;
}

interface GetInviteResponse {
  content: {
    id: string;
    role: Role;
    email: string;
    createdAt: string;
    updatedAt: string;
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
  };
}

export const getInvite = async ({ inviteId }: GetInviteRequest) => {
  const url = 'invites/details-invite/'.concat(inviteId);
  const result = await api.get(url).json<GetInviteResponse>();

  return result;
};

export type { GetInviteRequest, GetInviteResponse };
