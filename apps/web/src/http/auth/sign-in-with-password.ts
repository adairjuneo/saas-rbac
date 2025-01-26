import { api } from '../api-client';

interface SignInWithPasswordRequest {
  email: string;
  password: string;
}

interface SignInWithPasswordResponse {
  content: {
    token: string;
  };
}

export const signInWithPassword = async (
  request: SignInWithPasswordRequest
) => {
  const result = await api
    .post('api/auth/create-session-password', {
      json: {
        email: request.email,
        password: request.password,
      },
    })
    .json<SignInWithPasswordResponse>();

  return result;
};

export type { SignInWithPasswordRequest, SignInWithPasswordResponse };
