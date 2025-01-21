import type { IProjectsRepository } from '@/repositories/interfaces/projects.interface';
import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects.repository';

interface DeleteProjectUseCaseRequest {
  projectId: string;
  organizationId: string;
}

class DeleteProjectUseCase {
  constructor(private projectsRepository: IProjectsRepository) {}

  async execute(data: DeleteProjectUseCaseRequest): Promise<void> {
    const { projectId, organizationId } = data;

    await this.projectsRepository.delete(projectId, organizationId);
  }
}

const makeWithPrismaDeleteProjectUseCase = () => {
  const projectsRepository = new PrismaProjectsRepository();
  const deleteProjectUseCase = new DeleteProjectUseCase(projectsRepository);

  return deleteProjectUseCase;
};

export { DeleteProjectUseCase, makeWithPrismaDeleteProjectUseCase };
