import React from 'react';

import { CreateNewOrganizationForm } from './form';

export default function CreateOrganization() {
  return (
    <React.Fragment>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          Create new organization
        </h1>
        <CreateNewOrganizationForm />
      </div>
    </React.Fragment>
  );
}
