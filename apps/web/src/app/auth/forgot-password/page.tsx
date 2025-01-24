import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  return (
    <form action="#" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <Button type="submit" variant="default" className="w-full">
        Recover password
      </Button>

      <Button asChild type="submit" variant="link" size="sm" className="w-full">
        <Link href="/auth/sign-in">Back to sign in</Link>
      </Button>
    </form>
  );
}
