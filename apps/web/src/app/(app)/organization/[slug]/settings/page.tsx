import React from 'react';

import { OrganizationForm } from '@/app/(app)/create-organization/form';
import { getUserAbility } from '@/auth/user-membership';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ShutdownOrganizationButton } from './shutdown-organization-button';

export default async function SettingsPage() {
  const permissions = await getUserAbility();

  const canUpdateOrganization = permissions?.can('update', 'Organization');
  const canGetBilling = permissions?.can('get', 'Billing');
  const canShutdownOrganization = permissions?.can('delete', 'Organization');

  return (
    <React.Fragment>
      <h1 className="text-2xl font-medium text-foreground">Settings</h1>
      <div className="mt-4 space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>
                Update your organization details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm />
            </CardContent>
          </Card>
        )}

        {canGetBilling && (
          <Card>
            <CardHeader>
              <CardTitle>Billing details</CardTitle>
              <CardDescription>
                Billing details about this organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Billing details</p>
            </CardContent>
          </Card>
        )}

        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Shutdown organization</CardTitle>
              <CardDescription>
                This action will delete all organization data including all
                projects. You cannot undo this action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </React.Fragment>
  );
}
