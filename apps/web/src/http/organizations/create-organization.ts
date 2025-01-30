import { api } from '../api-client';

interface CreateOrganizationRequest {
  name: string;
  domain: string;
  avatarUrl: string | null;
  shouldAttachUsersByDomain: boolean;
}

interface CreateOrganizationResponse {
  content: {
    id: string;
    name: string;
    domain: string;
    shouldAttachUsersByDomain: boolean;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
    slug: string;
    ownerId: string;
  };
}

export const createOrganization = async (
  data: CreateOrganizationRequest
): Promise<CreateOrganizationResponse> => {
  const result = await api
    .post('organizations/create-organization', { json: data })
    .json<CreateOrganizationResponse>();

  return result;
};

export type { CreateOrganizationRequest, CreateOrganizationResponse };
