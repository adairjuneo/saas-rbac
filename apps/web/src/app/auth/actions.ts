'use server';

import { redirect } from 'next/navigation';

export const signInWithGitHub = async () => {
  const gitHubSignInURL = new URL(
    'login/oauth/authorize',
    'https://github.com'
  );

  gitHubSignInURL.searchParams.set(
    'client_id',
    process.env.GITHUB_CLIENT_ID ?? ''
  );
  gitHubSignInURL.searchParams.set(
    'redirect_url',
    process.env.GITHUB_REDIRECT_URL ?? ''
  );
  gitHubSignInURL.searchParams.set('scope', 'user:email');

  redirect(gitHubSignInURL.toString());
};
