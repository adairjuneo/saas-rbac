import React from 'react';

import { getUserAbility } from '@/auth/user-membership';

import InvitesMembers from './invites';
import ListMembers from './list-members';

export default async function MembersPage() {
  const permissions = await getUserAbility();

  return (
    <React.Fragment>
      <h1 className="text-2xl font-medium text-foreground">Members</h1>

      <div className="mt-4 space-y-4">
        {permissions?.can('get', 'invite') && <InvitesMembers />}
        {permissions?.can('get', 'User') && <ListMembers />}
      </div>
    </React.Fragment>
  );
}
