import { api } from '../api-client';

interface RemoveMemberRequest {
  orgSlug: string;
  memberId: string;
}

export const removeMember = async ({
  orgSlug,
  memberId,
}: RemoveMemberRequest): Promise<void> => {
  const url = 'members/'
    .concat(orgSlug)
    .concat('/remover-member/')
    .concat(memberId);
  await api.delete(url);
};

export type { RemoveMemberRequest };
