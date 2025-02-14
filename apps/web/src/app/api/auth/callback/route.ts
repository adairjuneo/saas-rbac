import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { signInWithGitHub } from '@/http/auth/sign-in-with-github';
import { acceptInvite } from '@/http/invites/accept-invite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cookiesStore = await cookies();

  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { message: 'GitHub OAuth code was not found.' },
      { status: 400 }
    );
  }

  const { content } = await signInWithGitHub({ code });

  cookiesStore.set('token', content.token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 3, // 3 Days
  });

  const inviteId = cookiesStore.get('inviteId')?.value;

  if (inviteId) {
    await acceptInvite({ inviteId });
    cookiesStore.delete('inviteId');
  }

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl);
}
