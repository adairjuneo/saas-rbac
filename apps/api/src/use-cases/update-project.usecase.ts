import type { IProjectsRepository } from '@/repositories/interfaces/projects.interface';
import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects.repository';

interface UpdateProjectUseCaseRequest {
  name: string;
  description: string;
  avatarUrl: string | null;
  projectId: string;
}

class UpdateProjectUseCase {
  constructor(private projectsRepository: IProjectsRepository) {}

  async execute(data: UpdateProjectUseCaseRequest): Promise<void> {
    const { name, description, avatarUrl, projectId } = data;

    await this.projectsRepository.update(projectId, {
      name,
      description,
      avatarUrl,
    });
  }
}

const makeWithPrismaUpdateProjectUseCase = () => {
  const projectsRepository = new PrismaProjectsRepository();
  const createOrganizationUseCase = new UpdateProjectUseCase(
    projectsRepository
  );
  return createOrganizationUseCase;
};

export { makeWithPrismaUpdateProjectUseCase, UpdateProjectUseCase };
