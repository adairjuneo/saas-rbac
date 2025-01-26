import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { signInWithGitHub } from '@/http/auth/sign-in-with-github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { message: 'GitHub OAuth code was not found.' },
      { status: 400 }
    );
  }

  const { content } = await signInWithGitHub({ code });

  (await cookies()).set('token', content.token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 3, // 3 Days
  });

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl);
}
