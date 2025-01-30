'use client';

import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from '@/hooks/use-form-state';
import { useToast } from '@/hooks/use-toast';

import { createNewOrganization } from './actions';

export const OrganizationForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [formState, handleSubmit, isPending] = useFormState(
    createNewOrganization,
    (response) => {
      router.push('/auth/sign-in');
      toast({
        variant: 'success',
        title: 'Successfully saved the Organization',
        description: response?.message,
      });
    },
    (response) => {
      toast({
        variant: 'destructive',
        title: 'Error to save Organization',
        description: response?.message,
      });
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!formState?.success && formState?.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save organization failed!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input
          autoFocus
          id="name"
          name="name"
          type="text"
          placeholder="Acme Org"
        />

        {formState?.errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formState.errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          id="domain"
          name="domain"
          type="text"
          inputMode="url"
          placeholder="acme.com"
        />

        {formState?.errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formState.errors.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <Checkbox
            id="shouldAttachUsersByDomain"
            name="shouldAttachUsersByDomain"
            className="translate-y-1"
          />

          <label htmlFor="shouldAttachUsersByDomain" className="space-y-2">
            <span className="text-sm font-medium leading-none">
              Auto-join new members
            </span>
            <p className="text-sm text-muted-foreground">
              This will automatically invite all members with same e-mail domain
              to this organization.
            </p>
          </label>
        </div>

        {formState?.errors?.shouldAttachUsersByDomain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formState.errors.shouldAttachUsersByDomain[0]}
          </p>
        )}
      </div>

      <Button
        disabled={isPending}
        type="submit"
        variant="default"
        className="w-full"
      >
        {!isPending ? (
          'Save organization'
        ) : (
          <LoaderCircle className="size-4 animate-spin" />
        )}
      </Button>
    </form>
  );
};
