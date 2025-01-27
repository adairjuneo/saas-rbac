import { api } from '../api-client';

interface SignUpUserRequest {
  name: string;
  email: string;
  password: string;
}

type SignUpUserResponse = Promise<void>;

export const signUpUser = async (
  request: SignUpUserRequest
): SignUpUserResponse => {
  await api.post('auth/create-user', {
    json: {
      name: request.name,
      email: request.email,
      password: request.password,
    },
  });
};

export type { SignUpUserRequest, SignUpUserResponse };
