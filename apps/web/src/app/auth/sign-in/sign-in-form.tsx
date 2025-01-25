'use client';

import { AlertTriangle, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState } from 'react';

import gitHubIcon from '@/assets/github-icon.svg';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { signInWithEmailAndPassword } from './actions';

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInWithEmailAndPassword,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {!state?.sucess && state?.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input autoFocus id="email" name="email" type="email" />

        {state?.errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />

        {state?.errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <Link
        href="/auth/forgot-password"
        className="text-xs font-medium text-foreground hover:underline"
      >
        Forgot your password?
      </Link>

      <Button
        disabled={isPending}
        type="submit"
        variant="default"
        className="w-full"
      >
        {!isPending ? (
          'Sign in with e-mail'
        ) : (
          <LoaderCircle className="size-4 animate-spin" />
        )}
      </Button>

      <Button
        disabled={isPending}
        asChild
        type="submit"
        variant="link"
        size="sm"
        className="w-full"
      >
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button
        disabled={isPending}
        type="button"
        variant="outline"
        className="w-full"
      >
        <Image src={gitHubIcon} className="mr-1 size-4 dark:invert" alt="" />
        Sign in with GitHub
      </Button>
    </form>
  );
}
