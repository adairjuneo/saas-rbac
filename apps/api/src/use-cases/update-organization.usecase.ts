import type { Organization } from '@prisma/client';

import { BadRequestError } from '@/errors/bad-request.error';
import type { IOrganizationsRepository } from '@/repositories/interfaces/organizations.interface';
import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations.repository';

interface UpdateOrganizationUseCaseRequest {
  organizationId: string;
  name: string;
  domain: string;
  shouldAttachUsersByDomain: boolean;
}

interface UpdateOrganizationUseCaseResponse {
  organization: Organization;
}

class UpdateOrganizationUseCase {
  constructor(private organizationsRepository: IOrganizationsRepository) {}

  async execute(
    data: UpdateOrganizationUseCaseRequest
  ): Promise<UpdateOrganizationUseCaseResponse> {
    const { organizationId, name, domain, shouldAttachUsersByDomain } = data;

    const organizationFindedByDomain =
      await this.organizationsRepository.findByDomain(domain);

    if (
      organizationFindedByDomain &&
      organizationFindedByDomain.id !== organizationId
    ) {
      throw new BadRequestError(
        'Already exists another organization with same domain.'
      );
    }

    const organizationUpdated = await this.organizationsRepository.update(
      organizationId,
      {
        name,
        domain,
        shouldAttachUsersByDomain,
      }
    );

    if (!organizationUpdated) {
      throw new BadRequestError(
        'This organization you have trying to update do not exist.'
      );
    }

    return { organization: organizationUpdated };
  }
}

const makeWithPrismaUpdateOrganizationUseCase = () => {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const createOrganizationUseCase = new UpdateOrganizationUseCase(
    organizationsRepository
  );
  return createOrganizationUseCase;
};

export { makeWithPrismaUpdateOrganizationUseCase, UpdateOrganizationUseCase };
