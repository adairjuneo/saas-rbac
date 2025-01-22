import type { IMembersRepository } from '@/repositories/interfaces/members.interface';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';

interface RemoveMemberOfOrganizationUseCaseRequest {
  memberId: string;
  organizationId: string;
}

class RemoveMemberOfOrganizationUseCase {
  constructor(private membersRepository: IMembersRepository) {}

  async execute(
    dataExecute: RemoveMemberOfOrganizationUseCaseRequest
  ): Promise<void> {
    const { memberId, organizationId } = dataExecute;

    await this.membersRepository.removeOfOrganization(memberId, organizationId);
  }
}

const makeWithPrismaRemoveMemberOfOrganizationUseCase = () => {
  const membersRepository = new PrismaMembersRepository();
  const removeMemberOfOrganizationUseCase =
    new RemoveMemberOfOrganizationUseCase(membersRepository);
  return removeMemberOfOrganizationUseCase;
};

export {
  makeWithPrismaRemoveMemberOfOrganizationUseCase,
  RemoveMemberOfOrganizationUseCase,
};
