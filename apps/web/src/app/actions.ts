'use server';

import { cookies } from 'next/headers';

export const getAuthToken = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('token')?.value;

  return { token };
};

export const setThemeCookie = async (themeCookie: string) => {
  const cookiesStore = await cookies();
  cookiesStore.set('theme', themeCookie);
};

export const getThemeCookie = async () => {
  const cookiesStore = await cookies();
  const theme = cookiesStore.get('theme')?.value;

  return { theme: theme ?? null };
};
