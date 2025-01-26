'use server';

import { redirect } from 'next/navigation';

export const signInWithGitHub = async () => {
  const gitHubSignInURL = new URL(
    'login/oauth/authorize',
    'https://github.com'
  );

  gitHubSignInURL.searchParams.set('client_id', 'Ov23li17KuPVqIAJtoDA');
  gitHubSignInURL.searchParams.set(
    'redirect_url',
    'http://localhost:3000/api/auth/callback'
  );
  gitHubSignInURL.searchParams.set('scope', 'user:email');

  redirect(gitHubSignInURL.toString());
};
