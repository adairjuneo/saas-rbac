import { api } from '../api-client';

interface UpdateMemberRequest {
  orgSlug: string;
  memberId: string;
  role: string;
}

export const updateMember = async ({
  orgSlug,
  memberId,
  role,
}: UpdateMemberRequest): Promise<void> => {
  const url = 'members/'
    .concat(orgSlug)
    .concat('/update-member/')
    .concat(memberId);
  await api.put(url, { json: { role } });
};

export type { UpdateMemberRequest };
