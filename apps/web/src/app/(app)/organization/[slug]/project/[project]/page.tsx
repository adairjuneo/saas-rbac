import React from 'react';

interface ProjectPageProps {
  params: Promise<{ slug: string; project: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const urlParams = await params;

  return (
    <React.Fragment>
      <main>
        <h1 className="text-2xl font-medium text-foreground">Project Page</h1>
        <p>{JSON.stringify(urlParams, null, 2)}</p>
        <code>{'/api/projects/{slug}/details-project/{projectSlug}'}</code>
      </main>
    </React.Fragment>
  );
}
