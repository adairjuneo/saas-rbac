'use client';

import { AlertTriangle, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useActionState } from 'react';

import gitHubIcon from '@/assets/github-icon.svg';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useFormState } from '@/hooks/use-form-state';

import { signInWithGitHub } from '../actions';
import { signUpNewUser } from './actions';

export default function SignUpForm() {
  const router = useRouter();

  const [__, authenticateWithGitHub, isPendingWithGithub] = useActionState(
    signInWithGitHub,
    null
  );

  const [formState, handleSubmit, isPending] = useFormState(
    signUpNewUser,
    () => {
      router.push('/auth/sign-in');
    }
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!formState?.success && formState?.message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign up failed!</AlertTitle>
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input autoFocus id="name" name="name" type="text" />

          {formState?.errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" />

          {formState?.errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />

          {formState?.errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm password</Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
          />

          {formState?.errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button
          disabled={isPending || isPendingWithGithub}
          type="submit"
          variant="default"
          className="w-full"
        >
          {!isPending ? (
            'Create account'
          ) : (
            <LoaderCircle className="size-4 animate-spin" />
          )}
        </Button>

        <Button
          disabled={isPending || isPendingWithGithub}
          asChild
          type="submit"
          variant="link"
          size="sm"
          className="w-full"
        >
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
        </Button>
      </form>

      <Separator />

      <form action={authenticateWithGitHub}>
        <Button
          disabled={isPending || isPendingWithGithub}
          type="submit"
          variant="outline"
          className="w-full"
        >
          {!isPendingWithGithub ? (
            <Fragment>
              <Image
                src={gitHubIcon}
                className="mr-1 size-4 dark:invert"
                alt=""
              />
              Sign up with GitHub
            </Fragment>
          ) : (
            <LoaderCircle className="size-4 animate-spin" />
          )}
        </Button>
      </form>
    </div>
  );
}
