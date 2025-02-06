import React from 'react';

import { OrganizationForm } from './form';

export default async function CreateOrganization() {
  return (
    <React.Fragment>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-lg space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Create organization
          </h1>
          <OrganizationForm />
        </div>
      </div>
    </React.Fragment>
  );
}
