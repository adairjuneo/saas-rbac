import { api } from '../api-client';

interface DeleteOrganizationRequest {
  orgSlug: string;
}

export const deleteOrganization = async ({
  orgSlug,
}: DeleteOrganizationRequest): Promise<void> => {
  const url = 'organizations/shutdown-organization/'.concat(orgSlug);
  await api.delete(url);
};

export type { DeleteOrganizationRequest };
