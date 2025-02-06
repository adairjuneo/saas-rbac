import { api } from '../api-client';

interface GetOrganizationDetailsRequest {
  orgSlug: string;
}

interface GetOrganizationDetailsResponse {
  content: {
    slug: string;
    name: string;
    id: string;
    avatarUrl: string | null;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
  };
}

export const getOrganizationDetails = async ({
  orgSlug,
}: GetOrganizationDetailsRequest) => {
  const url = 'organizations/get-details/'.concat(orgSlug);
  const result = await api.get(url).json<GetOrganizationDetailsResponse>();

  return result;
};

export type { GetOrganizationDetailsRequest, GetOrganizationDetailsResponse };
