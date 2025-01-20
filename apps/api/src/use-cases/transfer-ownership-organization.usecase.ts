import type { Member, Organization } from '@prisma/client';

import { BadRequestError } from '@/errors/bad-request.error';
import type { IMembersRepository } from '@/repositories/interfaces/members.interface';
import type { IOrganizationsRepository } from '@/repositories/interfaces/organizations.interface';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';
import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations.repository';

interface TransferOwnershipOrganizationUseCaseRequest {
  organizationId: string;
  userIdToSetOwner: string;
}

interface TransferOwnershipOrganizationUseCaseResponse {
  organization: Organization;
  member: Member;
}

class TransferOwnershipOrganizationUseCase {
  constructor(
    private organizationsRepository: IOrganizationsRepository,
    private membersRepository: IMembersRepository
  ) {}

  async execute(
    data: TransferOwnershipOrganizationUseCaseRequest
  ): Promise<TransferOwnershipOrganizationUseCaseResponse> {
    const { organizationId, userIdToSetOwner } = data;

    const userFindedMemberOfOrganization =
      await this.membersRepository.findUserMemberOfOrganization(
        userIdToSetOwner,
        organizationId
      );

    if (!userFindedMemberOfOrganization) {
      throw new BadRequestError(
        'That user provide is not a member of this organization.'
      );
    }

    const memberUpdated =
      await this.membersRepository.updateMemberRoleOnOrganization(
        userIdToSetOwner,
        organizationId,
        'ADMIN'
      );

    if (!memberUpdated) {
      throw new BadRequestError(
        'Error to try update that user to owner of this organization.'
      );
    }

    const organizationUpdated =
      await this.organizationsRepository.transferOwnerOfOrganization(
        organizationId,
        userIdToSetOwner
      );

    if (!organizationUpdated) {
      throw new BadRequestError(
        'Error to try update that user to owner of this organization.'
      );
    }

    return { organization: organizationUpdated, member: memberUpdated };
  }
}

const makeWithPrismaTransferOwnershipOrganizationUseCase = () => {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const membersRepository = new PrismaMembersRepository();
  const createOrganizationUseCase = new TransferOwnershipOrganizationUseCase(
    organizationsRepository,
    membersRepository
  );
  return createOrganizationUseCase;
};

export {
  makeWithPrismaTransferOwnershipOrganizationUseCase,
  TransferOwnershipOrganizationUseCase,
};
