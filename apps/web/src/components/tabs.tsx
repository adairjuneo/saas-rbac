import { cookies } from 'next/headers';

import { getUserAbility } from '@/auth/user-membership';

import { NavLink } from './nav-link';
import { Button } from './ui/button';

export const Tabs = async () => {
  const cookiesStore = await cookies();
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  const permissions = await getUserAbility();

  const canUpdateOrganization = permissions?.can('update', 'Organization');
  const canGetProjects = permissions?.can('get', 'Project');
  const canGetMembers = permissions?.can('get', 'User');
  const canGetBilling = permissions?.can('get', 'Billing');

  return (
    <nav className="mx-auto mb-4 flex w-full items-center gap-2 border-b pb-4">
      {canGetProjects && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/organization/${orgSlug}`}>Projects</NavLink>
        </Button>
      )}
      {canGetMembers && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/organization/${orgSlug}/members`}>Members</NavLink>
        </Button>
      )}
      {(canUpdateOrganization || canGetBilling) && (
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
      )}
    </nav>
  );
};
