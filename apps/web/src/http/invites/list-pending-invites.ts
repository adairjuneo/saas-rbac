import type { Role } from '@saas-rbac/auth';

import { api } from '../api-client';

interface ListPendingInvitesResponse {
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
  }[];
}

export const listPendingInvites = async () => {
  const url = 'invites/list-pending-invites';
  const result = await api.get(url).json<ListPendingInvitesResponse>();

  return result;
};

export type { ListPendingInvitesResponse };
