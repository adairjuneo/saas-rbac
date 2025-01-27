import { getUserAuth } from '@/auth/get-user-auth';

export default async function Home() {
  const { user } = await getUserAuth();

  return (
    <div className="h-screen w-full">
      <main className="">
        <h1 className="text-3xl font-bold">SaaS RBAC Web</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </main>
    </div>
  );
}
