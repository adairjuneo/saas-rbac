'use server';

import { api } from '@/http/api-client';
import { signInWithPassword } from '@/http/auth/sign-in-with-password';

export const signInWithEmailAndPassword = async (data: FormData) => {
  const { email, password } = Object.fromEntries(data);

  const { content } = await signInWithPassword({
    email: String(email),
    password: String(password),
  });

  console.log('result =>> ', content);
};
