import type { Prisma, Project } from '@prisma/client';

export interface IProjectsRepository {
  create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>;
}
