'use client';

import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormState } from '@/hooks/use-form-state';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/react-query';

import { createNewProject } from './actions';

export const ProjectForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { slug: orgSlug } = useParams<{ slug: string }>();

  const [formState, handleSubmit, isPending] = useFormState(
    createNewProject,
    (response) => {
      router.back();
      toast({
        variant: 'success',
        title: 'Successfully saved the Project',
        description: response?.message,
      });
      queryClient.invalidateQueries({
        queryKey: [orgSlug, 'projects'],
      });
    },
    (response) => {
      toast({
        variant: 'destructive',
        title: 'Error to save Project',
        description: response?.message,
      });
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!formState?.success && formState?.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed!</AlertTitle>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Project name</Label>
        <Input
          autoFocus
          id="name"
          name="name"
          type="text"
          placeholder="Project X"
        />

        {formState?.errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formState.errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Project description</Label>
        <Textarea
          rows={5}
          id="description"
          name="description"
          className="resize-y"
          placeholder="Lorem ipsum kasd stet sit duis dolores accumsan at luptatum."
        />

        {formState?.errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formState.errors.description[0]}
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
          'Save project'
        ) : (
          <LoaderCircle className="size-4 animate-spin" />
        )}
      </Button>
    </form>
  );
};
