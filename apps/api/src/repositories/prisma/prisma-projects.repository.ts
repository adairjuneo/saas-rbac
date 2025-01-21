import { Prisma, type Project } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { IProjectsRepository } from '../interfaces/projects.interface';

export class PrismaProjectsRepository implements IProjectsRepository {
  async create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    const project = await prisma.project.create({ data });

    return project;
  }

  async delete(projectId: string, organizationId: string): Promise<void> {
    await prisma.project.delete({
      where: {
        id: projectId,
        organizationId,
      },
    });
  }

  async findUnique(
    projectId: string,
    organizationId: string
  ): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        organizationId,
      },
    });

    return project;
  }
}
