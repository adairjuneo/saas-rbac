import { api } from '../api-client';

interface GetUserProfileResponse {
  content: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export const getUserProfile = async () => {
  const result = await api.get('users/profile').json<GetUserProfileResponse>();

  return result;
};

export type { GetUserProfileResponse };
