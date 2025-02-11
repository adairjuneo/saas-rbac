import { organizationSchema } from '@saas-rbac/auth';
import { ArrowLeftRight, Crown } from 'lucide-react';
import React from 'react';

import {
  getCurrentUserMembership,
  getUserAbility,
} from '@/auth/user-membership';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { getCurentOrganization, getListOfMembers } from './actions';
import { RemoveMemberButton } from './remove-member-button';
import UpdateMemberRoleSelect from './update-member-role-select';

const getInitialByName = (name: string) => {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .splice(0, 2)
    .join('');

  return initials;
};

export default async function ListMembers() {
  const permissions = await getUserAbility();

  const [members, membership, currentOrg] = await Promise.all([
    getListOfMembers(),
    getCurrentUserMembership(),
    getCurentOrganization(),
  ]);

  const parseToAuthOrg = organizationSchema.parse(currentOrg);

  const isBeAbleToTransferOwnership = Boolean(
    permissions?.can('transfer_ownership', parseToAuthOrg)
  );

  const isBeAbleToDeleteMember = Boolean(permissions?.can('delete', 'User'));
  const isBeAbleToUpdateMember = Boolean(permissions?.can('update', 'User'));

  return (
    <React.Fragment>
      <h2 className="mb-2 text-lg font-semibold">List of members</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {members?.map((member) => {
              const isTheOwner = member.user.id === currentOrg?.ownerId;
              const itsMe = membership?.userId === member.user.id;

              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: '3rem' }}>
                    <Avatar>
                      <AvatarFallback>
                        {getInitialByName(member.user.name || '')}
                      </AvatarFallback>
                      {member.user.avatarUrl && (
                        <AvatarImage
                          src={member.user.avatarUrl}
                          alt=""
                          width={32}
                          height={32}
                          className="aspect-square size-full"
                        />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="gap2 inline-flex items-center font-medium">
                        {member.user.name}
                        {itsMe && ' (me)'}
                        {isTheOwner && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Crown className="size-4" /> Owner
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        tabIndex={
                          isBeAbleToTransferOwnership && !isTheOwner ? 0 : -1
                        }
                        data-action-allowed={
                          isBeAbleToTransferOwnership && !isTheOwner
                        }
                        className="border border-border text-muted-foreground data-[action-allowed=false]:sr-only"
                      >
                        <ArrowLeftRight className="mr2 size-4" />
                        Transfer Ownership
                      </Button>
                      <UpdateMemberRoleSelect
                        itsMe={itsMe}
                        isTheOwner={isTheOwner}
                        defaultValue={member.role}
                        memberId={member.id}
                        isBeAbleToUpdateMember={isBeAbleToUpdateMember}
                      />
                      <RemoveMemberButton
                        memberId={member.id}
                        itsMe={itsMe}
                        isTheOwner={isTheOwner}
                        isBeAbleToDeleteMember={isBeAbleToDeleteMember}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
}
