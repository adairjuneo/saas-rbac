import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import type {
  IProjectsRepository,
  ProjectDTO,
} from '@/repositories/interfaces/projects.interface';
import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects.repository';

interface ListProjectsUseCaseRequest {
  organizationId: string;
}

interface ListProjectsUseCaseResponse {
  projects: ProjectDTO[];
}

class ListProjectsUseCase {
  constructor(private projectsRepository: IProjectsRepository) {}

  async execute(
    data: ListProjectsUseCaseRequest
  ): Promise<ListProjectsUseCaseResponse> {
    const { organizationId } = data;

    const listOfProjects =
      await this.projectsRepository.findMany(organizationId);

    if (!listOfProjects) {
      throw new ResourceNotFoundError();
    }

    return { projects: listOfProjects };
  }
}

const makeWithPrismaListProjectsUseCase = () => {
  const projectsRepository = new PrismaProjectsRepository();
  const getProjectDetailsUseCase = new ListProjectsUseCase(projectsRepository);

  return getProjectDetailsUseCase;
};

export { ListProjectsUseCase, makeWithPrismaListProjectsUseCase };
