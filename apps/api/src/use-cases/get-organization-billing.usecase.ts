import type { IMembersRepository } from '@/repositories/interfaces/members.interface';
import type { IProjectsRepository } from '@/repositories/interfaces/projects.interface';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';
import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects.repository';

interface GetOrganizationBillingUseCaseRequest {
  organizationId: string;
}

interface GetOrganizationBillingUseCaseResponse {
  billing: {
    seats: {
      amount: number;
      unit: number;
      price: number;
    };
    projects: {
      amount: number;
      unit: number;
      price: number;
    };
    total: number;
  };
}

class GetOrganizationBillingUseCase {
  constructor(
    private projectsRepository: IProjectsRepository,
    private membersRepository: IMembersRepository
  ) {}

  async execute(
    data: GetOrganizationBillingUseCaseRequest
  ): Promise<GetOrganizationBillingUseCaseResponse> {
    const { organizationId } = data;

    const amountOfMembers = await this.membersRepository.count({
      where: { organizationId, role: { not: 'BILLING' } },
    });

    const pricePerMember = amountOfMembers * 10;

    const amountOfProjects = await this.projectsRepository.count({
      where: { organizationId },
    });

    const pricePerProject = amountOfProjects * 20;

    const billing = {
      seats: {
        amount: amountOfMembers,
        unit: 10,
        price: pricePerMember,
      },
      projects: {
        amount: amountOfProjects,
        unit: 20,
        price: pricePerProject,
      },
      total: pricePerMember + pricePerProject,
    };

    return { billing };
  }
}

const makeWithPrismaGetOrganizationBillingUseCase = () => {
  const organizationsRepository = new PrismaProjectsRepository();
  const membersRepository = new PrismaMembersRepository();
  const getOrganizationBillingUseCase = new GetOrganizationBillingUseCase(
    organizationsRepository,
    membersRepository
  );
  return getOrganizationBillingUseCase;
};

export {
  GetOrganizationBillingUseCase,
  makeWithPrismaGetOrganizationBillingUseCase,
};
