import { api } from '../api-client';

interface CreateProjectRequest {
  orgSlug: string;
  name: string;
  avatarUrl: string | null;
  description: string;
}

interface CreateProjectResponse {
  content: {
    name: string;
    description: string;
    avatarUrl: string | null;
    slug: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    organizationId: string;
  };
}

export const createProject = async (
  data: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  const result = await api
    .post(`projects/${data.orgSlug}/create-project`, { json: data })
    .json<CreateProjectResponse>();

  return result;
};

export type { CreateProjectRequest, CreateProjectResponse };
