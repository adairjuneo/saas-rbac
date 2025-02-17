import { api } from '../api-client';

interface RejectInviteRequest {
  inviteId: string;
}

export const rejectInvite = async ({
  inviteId,
}: RejectInviteRequest): Promise<void> => {
  const url = 'invites/reject-invite/'.concat(inviteId);
  await api.patch(url);
};

export type { RejectInviteRequest };
