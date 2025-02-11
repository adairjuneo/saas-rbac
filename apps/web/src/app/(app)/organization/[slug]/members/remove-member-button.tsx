'use client';

import { LoaderCircle, UserMinus } from 'lucide-react';

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

import { removeMemberOfOrganization } from './actions';

interface RemoveMemberButton {
  memberId: string;
  itsMe: boolean;
  isTheOwner: boolean;
  isBeAbleToDeleteMember: boolean;
}

export function RemoveMemberButton(props: RemoveMemberButton) {
  const { memberId, itsMe, isTheOwner, isBeAbleToDeleteMember } = props;
  const { toast } = useToast();

  const [__, handleSubmit, isPending] = useFormState(
    removeMemberOfOrganization,
    (response) => {
      toast({
        variant: 'success',
        title: 'Successfully to remove member',
        description: response?.message,
      });
    },
    (response) => {
      toast({
        variant: 'destructive',
        title: 'Error to try remove member',
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
          tabIndex={isBeAbleToDeleteMember && !isTheOwner && !itsMe ? 0 : -1}
          data-action-allowed={isBeAbleToDeleteMember && !isTheOwner && !itsMe}
          className="border border-border data-[action-allowed=false]:sr-only"
        >
          <UserMinus className="mr2 size-4" />
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Remove member</DialogTitle>
            <DialogDescription>
              You have sure about remove this member of your organization? After
              confirm this action, you have to invite him again if necessary in
              the feature.
              <Input
                tabIndex={-1}
                id="memberId"
                name="memberId"
                type="text"
                className="sr-only"
                defaultValue={memberId}
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
