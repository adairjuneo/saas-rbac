import { api } from '../api-client';

interface ListOrganizationsResponse {
  content: {
    id: string;
    slug: string;
    name: string;
    avatarUrl: string | null;
  }[];
}

export const listOrganizations =
  async (): Promise<ListOrganizationsResponse> => {
    const result = await api
      .get('organizations/list-organizations', {
        next: { tags: ['list-organizations'] },
      })
      .json<ListOrganizationsResponse>();

    return result;
  };

export type { ListOrganizationsResponse };
