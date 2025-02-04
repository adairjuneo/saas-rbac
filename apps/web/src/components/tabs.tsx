import { cookies } from 'next/headers';

import { NavLink } from './nav-link';
import { Button } from './ui/button';

export const Tabs = async () => {
  const cookiesStore = await cookies();
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  return (
    <nav className="mx-auto mb-4 flex w-full items-center gap-2 border-b pb-4">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
      >
        <NavLink href={`/organization/${orgSlug}`}>Projects</NavLink>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
      >
        <NavLink href={`/organization/${orgSlug}/members`}>Members</NavLink>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
      >
        <NavLink href={`/organization/${orgSlug}/settings`}>
          Settings & Billing
        </NavLink>
      </Button>
    </nav>
  );
};
