import type { Prisma, Project } from '@prisma/client';

export interface IProjectsRepository {
  create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>;
  delete(projectId: string, organizationId: string): Promise<void>;
  update(
    projectId: string,
    data: Prisma.ProjectUncheckedUpdateInput
  ): Promise<void>;
  count({ where }: { where: Prisma.ProjectWhereInput }): Promise<number>;
  findMany(organizationId: string): Promise<Project[] | null>;
  findUnique(
    projectId: string | null,
    organizationId: string,
    projectSlug: string | null
  ): Promise<Project | null>;
}
