import React from 'react';

import { ProjectForm } from './form';

export default function CreateProject() {
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
