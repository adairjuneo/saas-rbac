import React from 'react';

import { Header } from '@/components/header';

export default async function Home() {
  return (
    <React.Fragment>
      <Header />
      <main>
        <h1 className="text-2xl font-medium text-foreground">Content</h1>
      </main>
    </React.Fragment>
  );
}
