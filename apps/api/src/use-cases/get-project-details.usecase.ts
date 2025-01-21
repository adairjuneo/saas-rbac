import type { Project } from '@prisma/client';

import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import type { IProjectsRepository } from '@/repositories/interfaces/projects.interface';
import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects.repository';

interface GetProjectDetailsUseCaseRequest {
  projectId: string;
  organizationId: string;
}

interface GetProjectDetailsUseCaseResponse {
  project: Project;
}

class GetProjectDetailsUseCase {
  constructor(private projectsRepository: IProjectsRepository) {}

  async execute(
    data: GetProjectDetailsUseCaseRequest
  ): Promise<GetProjectDetailsUseCaseResponse> {
    const { projectId, organizationId } = data;

    const projectFinded = await this.projectsRepository.findUnique(
      projectId,
      organizationId
    );

    if (!projectFinded) {
      throw new ResourceNotFoundError();
    }

    return { project: projectFinded };
  }
}

const makeWithPrismaGetProjectDetailsUseCase = () => {
  const projectsRepository = new PrismaProjectsRepository();
  const getProjectDetailsUseCase = new GetProjectDetailsUseCase(
    projectsRepository
  );

  return getProjectDetailsUseCase;
};

export { GetProjectDetailsUseCase, makeWithPrismaGetProjectDetailsUseCase };
