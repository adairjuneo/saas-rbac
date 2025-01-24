import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';
import Link from 'next/link';

import gitHubIcon from '@/assets/github-icon.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  return (
    <form action="#" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" variant="default" className="w-full">
        Sign in with e-mail
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={gitHubIcon} className="mr-1 size-4 dark:invert" alt="" />
        Sign in with GitHub
      </Button>
    </form>
  );
}
