import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { IProjectsRepository } from '../interfaces/projects.interface';

export class PrismaProjectsRepository implements IProjectsRepository {
  async create(data: Prisma.ProjectUncheckedCreateInput) {
    const project = await prisma.project.create({ data });

    return project;
  }
}
