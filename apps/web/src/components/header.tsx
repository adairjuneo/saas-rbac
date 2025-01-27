import Image from 'next/image';

import appLogo from '@/assets/app-logo.svg';

import { ProfileButton } from './profile-button';

export const Header = () => {
  return (
    <div className="mx-auto flex w-[75rem] items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Image src={appLogo} alt="SaaS RBAC" className="size-6 dark:invert" />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  );
};
