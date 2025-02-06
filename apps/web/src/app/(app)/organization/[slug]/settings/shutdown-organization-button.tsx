'use client';

import { LoaderCircle, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

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
import { useFormState } from '@/hooks/use-form-state';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/react-query';

import { shutdownOrganization } from './actions';

export function ShutdownOrganizationButton() {
  const { toast } = useToast();
  const router = useRouter();
  const { slug: orgSlug } = useParams<{ slug: string }>();

  const [__, handleSubmit, isPending] = useFormState(
    shutdownOrganization,
    (response) => {
      router.push('/');
      toast({
        variant: 'success',
        title: 'Successfully was shutdown organization',
        description: response?.message,
      });
      queryClient.invalidateQueries({
        queryKey: [orgSlug, 'projects'],
      });
    },
    (response) => {
      toast({
        variant: 'destructive',
        title: 'Error to try shutdown organization',
        description: response?.message,
      });
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" className="w-56">
          <Trash2 className="mr2 size-4" />
          Shutdown organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Shutdown organization</DialogTitle>
            <DialogDescription>
              You have sure about shutting down this organization? You cannot
              undo this action.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={isPending}
                autoFocus
                type="button"
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </DialogClose>
            <Button
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
