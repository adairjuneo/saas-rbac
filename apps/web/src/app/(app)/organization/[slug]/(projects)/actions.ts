import { cookies } from 'next/headers';

import { listProjects } from '@/http/projects/list-projects';

export const getListOfProjects = async () => {
  const cookiesStore = await cookies();
  const orgSlug = cookiesStore.get('org')?.value ?? null;

  try {
    const { content } = await listProjects({ orgSlug: orgSlug! });
    return content;
  } catch (error) {
    console.error(error);
  }
};
