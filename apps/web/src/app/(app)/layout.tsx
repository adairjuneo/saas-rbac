import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: 'SaaS RBAC App',
  description: 'Home - SaaS RBAC App',
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = !!(await cookies()).get('token')?.value;

  if (!isAuthenticated) {
    redirect('/auth/sign-in');
  }

  return <React.Fragment>{children}</React.Fragment>;
}
