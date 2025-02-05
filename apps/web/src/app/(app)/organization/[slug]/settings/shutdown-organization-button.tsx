import { Trash2 } from 'lucide-react';

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

export function ShutdownOrganizationButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" className="w-56">
          <Trash2 className="mr2 size-4" />
          Shutdown organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shutdown organization</DialogTitle>
          <DialogDescription>
            You have sure about shutting down this organization? You cannot undo
            this action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button autoFocus type="button" variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" size="sm">
            Yes, i&apos;am sure.
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
