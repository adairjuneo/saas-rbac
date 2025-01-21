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
}
