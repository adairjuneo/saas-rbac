import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { getUserAbility } from '@/auth/user-membership';
import { Button } from '@/components/ui/button';

import ProjectsList from './projects-list';

interface OrganizationProjectsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OrganizationProjectsPage({
  params,
}: OrganizationProjectsPageProps) {
  const urlParams = await params;
  const permissions = await getUserAbility();
  const createProjectPath = '/organization/'
    .concat(urlParams.slug)
    .concat('/create-project');

  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-foreground">Projects</h1>

        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={createProjectPath}>
              <PlusCircle className="size-4" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') ? (
        <ProjectsList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to see organization projects.
        </p>
      )}
    </React.Fragment>
  );
}
