import type { Prisma, Project } from '@prisma/client';
import { z } from 'zod';

export const projectsSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  description: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string(),
  organizationId: z.string(),
  owner: z.object({
    id: z.string(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
  }),
});

export type ProjectDTO = z.infer<typeof projectsSchema>;

export interface IProjectsRepository {
  create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>;
  delete(projectId: string, organizationId: string): Promise<void>;
  update(
    projectId: string,
    data: Prisma.ProjectUncheckedUpdateInput
  ): Promise<void>;
  count({ where }: { where: Prisma.ProjectWhereInput }): Promise<number>;
  findMany(organizationId: string): Promise<ProjectDTO[] | null>;
  findUnique(
    projectId: string | null,
    organizationId: string,
    projectSlug: string | null
  ): Promise<Project | null>;
}
