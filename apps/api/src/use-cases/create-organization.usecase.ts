import type { Organization } from '@prisma/client';

import { BadRequestError } from '@/errors/bad-request.error';
import { createSlug } from '@/lib/create-slug';
import type { IMembersRepository } from '@/repositories/interfaces/members.interface';
import type { IOrganizationsRepository } from '@/repositories/interfaces/organizations.interface';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';
import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations.repository';

interface CreateOrganizationUseCaseRequest {
  ownerId: string;
  name: string;
  domain: string;
  avatarUrl: string | null;
  shouldAttachUsersByDomain: boolean;
}

interface CreateOrganizationUseCaseResponse {
  organization: Organization;
}

class CreateOrganizationUseCase {
  constructor(
    private membersRepository: IMembersRepository,
    private organizationsRepository: IOrganizationsRepository
  ) {}

  async execute(
    data: CreateOrganizationUseCaseRequest
  ): Promise<CreateOrganizationUseCaseResponse> {
    const { name, domain, ownerId, avatarUrl, shouldAttachUsersByDomain } =
      data;

    const organizationFindedByDomain =
      await this.organizationsRepository.findByDomain(domain);

    if (organizationFindedByDomain) {
      throw new BadRequestError(
        'Already exists another organization with same domain.'
      );
    }

    const organizationCreated = await this.organizationsRepository.create({
      name,
      domain,
      avatarUrl,
      shouldAttachUsersByDomain,
      slug: createSlug(name),
      ownerId,
    });

    await this.membersRepository.createUserAdminOfOrganization(
      ownerId,
      organizationCreated.id
    );

    return { organization: organizationCreated };
  }
}

const makeWithPrismaCreateOrganizationUseCase = () => {
  const membersRepository = new PrismaMembersRepository();
  const organizationsRepository = new PrismaOrganizationsRepository();
  const createOrganizationUseCase = new CreateOrganizationUseCase(
    membersRepository,
    organizationsRepository
  );
  return createOrganizationUseCase;
};

export { CreateOrganizationUseCase, makeWithPrismaCreateOrganizationUseCase };
