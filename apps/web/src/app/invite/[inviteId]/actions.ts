'use server';

import { redirect } from 'next/navigation';

import { getInvite } from '@/http/invites/get-invite';

export const getInviteById = async ({ inviteId }: { inviteId: string }) => {
  try {
    const { content } = await getInvite({ inviteId });
    return content;
  } catch (error) {
    console.error(error);
    redirect('/');
  }
};
