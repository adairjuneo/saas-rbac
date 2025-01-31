import { InterceptedSheetContent } from '@/components/intercepted-sheet-content';
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { OrganizationForm } from '../../create-organization/form';

export default function CreateOrganizationDrawer() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent className="min-w-[25%]">
        <SheetHeader>
          <SheetTitle>Create organization</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <OrganizationForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  );
}
