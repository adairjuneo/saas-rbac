import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, LogIn, LogOut } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getUserAuth, userAuthenticated } from '@/auth/get-user-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { acceptInvite } from '@/http/invites/accept-invite';

import { getInviteById } from './actions';

interface InvitePageParams {
  params: Promise<{ inviteId: string }>;
}

const getInitialByName = (name: string) => {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .splice(0, 2)
    .join('');

  return initials;
};

export default async function InvitePage({ params }: InvitePageParams) {
  const { inviteId } = await params;

  const invite = await getInviteById({ inviteId });
  const isUserAuthenticated = await userAuthenticated();

  let currentUserEmail = null;

  if (isUserAuthenticated) {
    const { user } = await getUserAuth();

    currentUserEmail = user.email;
  }

  const userAuthenticatedIsTheSameFromInvite =
    currentUserEmail === invite?.email;

  const submitSignInAndAcceptInvite = async () => {
    'use server';
    const cookiesStore = await cookies();

    cookiesStore.set('inviteId', inviteId);

    redirect('/auth/sign-in/?email='.concat(String(invite?.email)));
  };

  const submitAcceptInviteAndRedirect = async () => {
    'use server';
    const cookiesStore = await cookies();

    await acceptInvite({ inviteId });
    cookiesStore.delete('inviteId');

    redirect('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite?.author?.avatarUrl && (
              <AvatarImage src={invite?.author?.avatarUrl} />
            )}
            <AvatarFallback>
              {getInitialByName(invite?.author?.name || 'Someone')}
            </AvatarFallback>
          </Avatar>

          <p className="text-balance text-center leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              {invite?.author?.name ?? 'Someone'}{' '}
            </span>
            invited you to join{' '}
            <span className="font-medium text-foreground">
              {invite?.organization?.name}
            </span>
            .{' '}
            <span className="text-xs">
              {formatDistanceToNow(invite?.createdAt ?? new Date(), {
                addSuffix: true,
              })}
            </span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={submitSignInAndAcceptInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="size-4" />
              Sign in to accept the invite
            </Button>
          </form>
        )}

        {userAuthenticatedIsTheSameFromInvite && (
          <form action={submitAcceptInviteAndRedirect}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircle className="size-4" />
              Join {invite.organization?.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userAuthenticatedIsTheSameFromInvite && (
          <div className="space-y-4">
            <p className="text-balance text-center leading-relaxed text-muted-foreground">
              This invite was send to{' '}
              <span className="font-medium text-foreground">
                {invite.email}
              </span>{' '}
              but you are currently authenticated as{' '}
              <span className="font-medium text-foreground">
                {currentUserEmail}
              </span>
            </p>

            <div className="space-y-2">
              <Button asChild className="w-full" variant="secondary">
                <a href="/api/auth/sign-out">
                  <LogOut className="size-4" />
                  Sign out from {currentUserEmail}
                </a>
              </Button>

              <Button asChild className="w-full" variant="outline">
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
