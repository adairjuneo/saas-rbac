import { ProjectForm } from '@/app/(app)/organization/[slug]/create-project/form';
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content';
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function CreateOrganizationDrawer() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent
        className="min-w-[25%]"
        aria-describedby="Create project"
      >
        <SheetHeader>
          <SheetTitle>Create project</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ProjectForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  );
}
