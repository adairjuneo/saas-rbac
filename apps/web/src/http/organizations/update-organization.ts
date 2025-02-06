import { api } from '../api-client';

interface UpdateOrganizationRequest {
  orgSlug: string;
  name: string;
  domain: string;
  avatarUrl: string | null;
  shouldAttachUsersByDomain: boolean;
}

interface UpdateOrganizationResponse {
  content: {
    name: string;
    domain: string | null;
    shouldAttachUsersByDomain: boolean | null;
    slug: string;
    id: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
  };
}

export const updateOrganization = async (
  data: UpdateOrganizationRequest
): Promise<UpdateOrganizationResponse> => {
  const url = String('organizations/update-organization/').concat(data.orgSlug);
  const result = await api
    .put(url, { json: data })
    .json<UpdateOrganizationResponse>();

  return result;
};

export type { UpdateOrganizationRequest, UpdateOrganizationResponse };
