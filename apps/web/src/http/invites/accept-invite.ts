import { api } from '../api-client';

interface AcceptInviteRequest {
  inviteId: string;
}

export const acceptInvite = async ({
  inviteId,
}: AcceptInviteRequest): Promise<void> => {
  const url = 'invites/accept-invite/'.concat(inviteId);
  await api.patch(url);
};

export type { AcceptInviteRequest };
