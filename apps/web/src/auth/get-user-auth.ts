import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getUserProfile } from '@/http/auth/get-user-profile';

export const userAuthenticated = async () => {
  return Boolean((await cookies()).get('token')?.value);
};

export const getUserAuth = async () => {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    redirect('/auth/sign-in');
  }

  try {
    const { content } = await getUserProfile();

    return { user: content };
  } catch (error) {
    console.error(error);
  }

  redirect('api/auth/sign-out');
};
