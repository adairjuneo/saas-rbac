import type { Project } from '@prisma/client';

import { createSlug } from '@/lib/create-slug';
import type { IProjectsRepository } from '@/repositories/interfaces/projects.interface';
import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects.repository';

interface CreateProjectUseCaseRequest {
  name: string;
  description: string;
  avatarUrl: string | null;
  ownerId: string;
  organizationId: string;
}

interface CreateProjectUseCaseResponse {
  project: Project;
}

class CreateProjectUseCase {
  constructor(private projectsRepository: IProjectsRepository) {}

  async execute(
    data: CreateProjectUseCaseRequest
  ): Promise<CreateProjectUseCaseResponse> {
    const { name, description, avatarUrl, ownerId, organizationId } = data;

    const projectCreated = await this.projectsRepository.create({
      name,
      description,
      avatarUrl,
      slug: createSlug(name),
      ownerId,
      organizationId,
    });

    return { project: projectCreated };
  }
}

const makeWithPrismaCreateProjectUseCase = () => {
  const projectsRepository = new PrismaProjectsRepository();
  const createOrganizationUseCase = new CreateProjectUseCase(
    projectsRepository
  );
  return createOrganizationUseCase;
};

export { CreateProjectUseCase, makeWithPrismaCreateProjectUseCase };
