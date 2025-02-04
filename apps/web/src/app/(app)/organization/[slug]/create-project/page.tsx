import { redirect } from 'next/navigation';
import React from 'react';

import { getUserAbility } from '@/auth/user-membership';

import { ProjectForm } from './form';

interface CreateProjectProps {
  params: Promise<{ slug: string }>;
}

export default async function CreateProject({ params }: CreateProjectProps) {
  const { slug: orgSlug } = await params;

  const permissions = await getUserAbility();

  if (permissions?.cannot('create', 'Project')) {
    redirect(String('/organization/').concat(orgSlug));
  }

  return (
    <React.Fragment>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-lg space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Create Project</h1>
          <ProjectForm />
        </div>
      </div>
    </React.Fragment>
  );
}
