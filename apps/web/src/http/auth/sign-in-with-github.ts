import { api } from '../api-client';

interface SignInWithGitHubRequest {
  code: string;
}

interface SignInWithGitHubResponse {
  content: {
    token: string;
  };
}

export const signInWithGitHub = async (request: SignInWithGitHubRequest) => {
  const result = await api
    .post('auth/create-session-github', {
      json: {
        code: request.code,
      },
    })
    .json<SignInWithGitHubResponse>();

  return result;
};

export type { SignInWithGitHubRequest, SignInWithGitHubResponse };
