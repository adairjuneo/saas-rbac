import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'SaaS RBAC App',
  description: 'Login - Saas RBAC App',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = !!(await cookies()).get('token')?.value;

  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">{children}</div>
    </main>
  );
}
