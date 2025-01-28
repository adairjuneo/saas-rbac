import { Slash } from 'lucide-react';
import Image from 'next/image';

import appLogo from '@/assets/app-logo.svg';
import { getUserAbility } from '@/auth/user-membership';

import { OrganizationSwitcher } from './organization-switcher';
import { ProfileButton } from './profile-button';

export const Header = async () => {
  const permissions = await getUserAbility();

  return (
    <header className="mx-auto flex w-[75rem] items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Image src={appLogo} alt="SaaS RBAC" className="size-6 dark:invert" />

        <Slash className="size-6 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && <p>Projects</p>}
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </header>
  );
};
