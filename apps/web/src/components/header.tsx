import { Slash } from 'lucide-react';
import Image from 'next/image';
import { Fragment } from 'react';

import appLogo from '@/assets/app-logo.svg';
import { getUserAbility } from '@/auth/user-membership';

import { OrganizationSwitcher } from './organization-switcher';
import { ProfileButton } from './profile-button';
import { ProjectSwitcher } from './project-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { Separator } from './ui/separator';

export const Header = async () => {
  const permissions = await getUserAbility();

  return (
    <header className="mx-auto mb-4 flex h-20 w-[75rem] items-center justify-between border-b py-4 pb-2">
      <div className="flex items-center gap-3">
        <Image src={appLogo} alt="SaaS RBAC" className="size-6 dark:invert" />

        <Slash className="size-6 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && (
          <Fragment>
            <Slash className="size-6 -rotate-[24deg] text-border" />
            <ProjectSwitcher />
          </Fragment>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </header>
  );
};
