import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import type { IOrganizationsRepository } from '@/repositories/interfaces/organizations.interface';
import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations.repository';

interface ShutdownOrganizationUseCaseRequest {
  organizationId: string;
}

interface ShutdownOrganizationUseCaseResponse {
  organizationHasBeenOff: boolean;
}

class ShutdownOrganizationUseCase {
  constructor(private organizationsRepository: IOrganizationsRepository) {}

  async execute(
    data: ShutdownOrganizationUseCaseRequest
  ): Promise<ShutdownOrganizationUseCaseResponse> {
    const { organizationId } = data;

    const organizationOff =
      await this.organizationsRepository.shutdownOrganizationById(
        organizationId
      );

    if (organizationOff === null) {
      throw new ResourceNotFoundError();
    }

    return { organizationHasBeenOff: true };
  }
}

const makeWithPrismaShutdownOrganizationUseCase = () => {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const createOrganizationUseCase = new ShutdownOrganizationUseCase(
    organizationsRepository
  );
  return createOrganizationUseCase;
};

export {
  makeWithPrismaShutdownOrganizationUseCase,
  ShutdownOrganizationUseCase,
};
