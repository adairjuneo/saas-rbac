'use client';

import { LoaderCircle, MailMinus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useFormState } from '@/hooks/use-form-state';
import { useToast } from '@/hooks/use-toast';

import { revokeInviteForThisOrganization } from './actions';

interface RevokeInviteButtonProps {
  inviteId: string;
  isBeAbleToRevokeInvite: boolean;
}

export function RevokeInviteButton(props: RevokeInviteButtonProps) {
  const { inviteId, isBeAbleToRevokeInvite } = props;
  const { toast } = useToast();

  const [__, handleSubmit, isPending] = useFormState(
    revokeInviteForThisOrganization,
    (response) => {
      toast({
        variant: 'success',
        title: 'Successfully to revoke this member invite',
        description: response?.message,
      });
    },
    (response) => {
      toast({
        variant: 'destructive',
        title: 'Error to try revoke this member invite',
        description: response?.message,
      });
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          tabIndex={isBeAbleToRevokeInvite ? 0 : -1}
          data-action-allowed={isBeAbleToRevokeInvite}
          className="border border-border data-[action-allowed=false]:sr-only"
        >
          <MailMinus className="mr2 size-4" />
          Revoke Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Remoke member invite</DialogTitle>
            <DialogDescription>
              You have sure about revoke this member invite to your
              organization? After confirm this action, you have to create
              another invite if necessary.
              <Input
                tabIndex={-1}
                id="inviteId"
                name="inviteId"
                type="text"
                className="sr-only"
                defaultValue={inviteId}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-1.5">
            <DialogClose asChild>
              <Button
                autoFocus
                disabled={isPending}
                type="button"
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              className="w-32"
              disabled={isPending}
              type="submit"
              variant="destructive"
              size="sm"
            >
              {!isPending ? (
                "Yes, i'am sure."
              ) : (
                <LoaderCircle className="size-4 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
