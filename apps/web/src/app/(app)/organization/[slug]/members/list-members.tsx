import { organizationSchema } from '@saas-rbac/auth';
import { ArrowLeftRight } from 'lucide-react';
import React from 'react';

import {
  getCurrentUserMembership,
  getUserAbility,
} from '@/auth/user-membership';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { getCurentOrganization, getListOfMembers } from './actions';

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

  const members = await getListOfMembers();
  const membership = await getCurrentUserMembership();
  const currentOrg = await getCurentOrganization();

  const parseToAuthOrg = organizationSchema.parse(currentOrg);

  return (
    <React.Fragment>
      <h2 className="mb-2 text-lg font-semibold">List of members</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {members?.map((member) => {
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
                        {membership?.userId === member.user.id && ' (me)'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {permissions?.can(
                        'transfer_ownership',
                        parseToAuthOrg
                      ) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border border-border text-muted-foreground"
                        >
                          <ArrowLeftRight className="mr2 size-4" />
                          Transfer Ownership
                        </Button>
                      )}
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
