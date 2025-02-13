'use client';

import { LoaderCircle, UserPlus } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
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

import { sendNewInviteForThisOrganization } from './actions';

export const CreateInviteForm = () => {
  const { toast } = useToast();

  const [formState, handleSubmit, isPending] = useFormState(
    sendNewInviteForThisOrganization,
    (response) => {
      toast({
        variant: 'success',
        title: 'Successfully to send a new invitation',
        description: response?.message,
      });
    },
    (response) => {
      toast({
        variant: 'destructive',
        title: 'Error to try send a new invitation',
        description: response?.message,
      });
    }
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-row gap-2">
      <div className="flex-1 space-y-1">
        <Input
          autoFocus
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
        />

        {formState?.errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formState.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>

        {formState?.errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formState.errors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Button
          disabled={isPending}
          type="submit"
          variant="default"
          className="w-32"
        >
          {!isPending ? (
            <React.Fragment>
              <UserPlus className="size-4" />
              Send Invite
            </React.Fragment>
          ) : (
            <LoaderCircle className="size-4 animate-spin" />
          )}
        </Button>
      </div>
    </form>
  );
};
