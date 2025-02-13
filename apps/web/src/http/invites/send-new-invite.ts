import type { Role } from '@saas-rbac/auth';

import { api } from '../api-client';

interface SendNewInviteRequest {
  orgSlug: string;
  email: string;
  role: Role;
}

export const sendNewInvite = async ({
  orgSlug,
  email,
  role,
}: SendNewInviteRequest): Promise<void> => {
  const url = 'invites/'.concat(orgSlug).concat('/create-invite');
  await api.post(url, { json: { email, role } });
};

export type { SendNewInviteRequest };
