'use client';

import { LoaderCircle, X } from 'lucide-react';
import { type ComponentProps, useState } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormState } from '@/hooks/use-form-state';
import { useToast } from '@/hooks/use-toast';

import { updateRoleMemberInOrganization } from './actions';

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string;
}

export default function UpdateMemberRoleSelect(
  props: UpdateMemberRoleSelectProps
) {
  const { memberId, ...rest } = props;
  const { toast } = useToast();
  const [changingRole, setChangingRole] = useState(false);

  const confirmUpdateMemberRole = () => setChangingRole(true);
  const onDismissChangingRole = () => setChangingRole(false);

  const [__, handleSubmit, isPending] = useFormState(
    updateRoleMemberInOrganization,
    (response) => {
      onDismissChangingRole();
      toast({
        variant: 'success',
        title: 'Successfully to update member role',
        description: response?.message,
      });
    },
    (response) => {
      onDismissChangingRole();
      toast({
        variant: 'destructive',
        title: 'Error to try update member role',
        description: response?.message,
      });
    }
  );

  return (
    <Dialog open={changingRole}>
      <DialogTrigger asChild>
        <Select
          name="role"
          onValueChange={confirmUpdateMemberRole}
          disabled={isPending}
          {...rest}
        >
          <SelectTrigger className="h-9 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={onDismissChangingRole}
        onPointerDownOutside={onDismissChangingRole}
      >
        <form onSubmit={handleSubmit}>
          <Input
            tabIndex={-1}
            id="memberId"
            name="memberId"
            type="text"
            className="sr-only w-0"
            defaultValue={memberId}
          />
          <DialogClose
            onClick={onDismissChangingRole}
            className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              You have sure about change role this member?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-1.5">
            <DialogClose asChild>
              <Button
                disabled={isPending}
                autoFocus
                type="button"
                variant="outline"
                size="sm"
                onClick={onDismissChangingRole}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              type="submit"
              variant="secondary"
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
