import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaS RBAC App',
  description: 'Login - Saas RBAC App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">{children}</div>
    </main>
  );
}
