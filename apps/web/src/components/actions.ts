'use server';

import { revalidateTag } from 'next/cache';

import { acceptInvite } from '@/http/invites/accept-invite';
import { rejectInvite } from '@/http/invites/reject-invite';

export const acceptInviteAction = async (inviteId: string) => {
  acceptInvite({ inviteId });
  revalidateTag('list-organizations');
};

export const rejectInviteAction = async (inviteId: string) => {
  rejectInvite({ inviteId });
};
