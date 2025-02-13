import { api } from '../api-client';

interface ListProjectsRequest {
  orgSlug: string;
}

interface ListProjectsResponse {
  content: {
    description: string;
    slug: string;
    id: string;
    name: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    organizationId: string;
    owner: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    };
  }[];
}

export const listProjects = async (
  data: ListProjectsRequest
): Promise<ListProjectsResponse> => {
  const result = await api
    .get(`projects/${data.orgSlug}/list-projects`)
    .json<ListProjectsResponse>();

  return result;
};

export type { ListProjectsRequest, ListProjectsResponse };
