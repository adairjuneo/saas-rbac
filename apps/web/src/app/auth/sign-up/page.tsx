import Image from 'next/image';
import Link from 'next/link';

import gitHubIcon from '@/assets/github-icon.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SignUpPage() {
  return (
    <form action="#" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm password</Label>
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password_confirmation"
        />
      </div>

      <Button type="submit" variant="default" className="w-full">
        Create account
      </Button>

      <Button asChild type="submit" variant="link" size="sm" className="w-full">
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={gitHubIcon} className="mr-1 size-4 dark:invert" alt="" />
        Sign up with GitHub
      </Button>
    </form>
  );
}
