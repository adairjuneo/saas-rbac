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

  async update(
    projectId: string,
    data: Prisma.ProjectUncheckedUpdateInput
  ): Promise<void> {
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data,
    });
  }

  async findMany(organizationId: string): Promise<Project[] | null> {
    const project = await prisma.project.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        organizationId: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return project;
  }

  async findUnique(
    projectId: string | null,
    organizationId: string,
    projectSlug: string | null
  ): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId ?? undefined,
        organizationId,
        slug: projectSlug ?? undefined,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        organizationId: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return project;
  }
}
