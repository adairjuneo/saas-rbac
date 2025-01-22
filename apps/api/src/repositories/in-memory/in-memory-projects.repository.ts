import { randomUUID } from 'node:crypto';

import type { Prisma, Project } from '@prisma/client';

import type { IProjectsRepository } from '../interfaces/projects.interface';

export class InMemoryProjectsRepository implements IProjectsRepository {
  public items: Project[] = [];

  async create(data: Prisma.ProjectUncheckedCreateInput) {
    const project = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      avatarUrl: data.avatarUrl ?? null,
      slug: data.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: data.ownerId,
      organizationId: data.organizationId,
    };

    this.items.push(project);

    return project;
  }

  delete(projectId: string, organizationId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  update(
    projectId: string,
    data: Prisma.ProjectUncheckedUpdateInput
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findMany(organizationId: string): Promise<Project[] | null> {
    throw new Error('Method not implemented.');
  }

  findUnique(
    projectId: string | null,
    organizationId: string,
    projectSlug: string | null
  ): Promise<Project | null> {
    throw new Error('Method not implemented.');
  }
}
