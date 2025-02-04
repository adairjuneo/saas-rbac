import type { Metadata } from 'next';
import React from 'react';

import { Tabs } from '@/components/tabs';

export const metadata: Metadata = {
  title: 'SaaS RBAC App',
  description: 'Organization - SaaS RBAC App',
};

export default async function OrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <Tabs />
      {children}
    </React.Fragment>
  );
}
