import React from 'react';

import { getUserAbility } from '@/auth/user-membership';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { getListInvitesNewMembers } from './actions';
import { RevokeInviteButton } from './revoke-invite-button';

export default async function InvitesMembers() {
  const permissions = await getUserAbility();
  const invitesList = await getListInvitesNewMembers();

  const isBeAbleToRevokeInvite = permissions?.can('delete', 'invite');

  return (
    <React.Fragment>
      {permissions?.can('create', 'invite') && (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
          </CardHeader>
          <CardContent>Content to invite a member</CardContent>
        </Card>
      )}

      {permissions?.can('get', 'invite') && (
        <React.Fragment>
          <h2 className="mb-2 text-lg font-semibold">Invites</h2>
          <div className="rounded border">
            <Table>
              <TableBody>
                {invitesList?.length === 0 && (
                  <TableRow>
                    <TableCell className="py-2.5">
                      <div className="flex justify-center">
                        <p className="text-base text-muted-foreground">
                          No invitation was sent.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {invitesList?.map((invite) => {
                  return (
                    <TableRow key={invite.id}>
                      <TableCell className="py-2.5">
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">
                            {invite?.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {invite?.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex justify-end">
                          <RevokeInviteButton
                            inviteId={invite.id}
                            isBeAbleToRevokeInvite={Boolean(
                              isBeAbleToRevokeInvite
                            )}
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
      )}
    </React.Fragment>
  );
}
