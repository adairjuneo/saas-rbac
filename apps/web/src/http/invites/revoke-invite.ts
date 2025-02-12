import { api } from '../api-client';

interface RevokeInviteRequest {
  orgSlug: string;
  inviteId: string;
}

export const revokeInvite = async ({
  orgSlug,
  inviteId,
}: RevokeInviteRequest): Promise<void> => {
  const url = 'invites/'
    .concat(orgSlug)
    .concat('/revoke-invite/')
    .concat(inviteId);
  await api.post(url);
};

export type { RevokeInviteRequest };
