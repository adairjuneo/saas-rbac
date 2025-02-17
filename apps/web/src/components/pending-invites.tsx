'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Check, UserPlus2, X } from 'lucide-react';
import React from 'react';

import { listPendingInvites } from '@/http/invites/list-pending-invites';

import { acceptInviteAction, rejectInviteAction } from './actions';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

export default function PedingInvites() {
  const queryClient = useQueryClient();
  const { data: pendingInvites, isLoading } = useQuery({
    queryFn: () => listPendingInvites(),
    queryKey: ['pending-invites'],
  });

  const handleAcceptInvite = async (inviteId: string) => {
    await acceptInviteAction(inviteId);
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
  };

  const handleRejectInvite = async (inviteId: string) => {
    await rejectInviteAction(inviteId);
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled={isLoading}>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending Invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Pending invites {pendingInvites?.content.length}
        </span>

        {pendingInvites?.content.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You do not have any pending invites.
          </p>
        )}

        {pendingInvites?.content.map((pendingInvite, index) => {
          const isTheLastOne = index + 1 === pendingInvites.content.length;

          return (
            <React.Fragment key={pendingInvite.id}>
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {pendingInvite.author?.name ?? 'Someone'}
                  </span>{' '}
                  invited you to join{' '}
                  <span className="font-medium text-foreground">
                    {pendingInvite.organization?.name ?? 'In organization'}
                  </span>{' '}
                  <span>
                    {formatDistanceToNow(new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                  .
                </p>

                <div className="flex gap-1">
                  <Button
                    onClick={() => handleAcceptInvite(pendingInvite.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Check className="size-3" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRejectInvite(pendingInvite.id)}
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    <X className="size-3" />
                    Reject
                  </Button>
                </div>
              </div>
              {!isTheLastOne && pendingInvites?.content.length > 1 && (
                <Separator />
              )}
            </React.Fragment>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
