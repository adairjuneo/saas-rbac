import type {
  CreateUpdateMemberDTO,
  IMembersRepository,
  MemberDTO,
} from '@/repositories/interfaces/members.interface';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';

interface UpdateMemberUseCaseRequest {
  memberId: string;
  organizationId: string;
  data: CreateUpdateMemberDTO;
}

interface UpdateMemberUseCaseResponse {
  member: MemberDTO;
}

class UpdateMemberUseCase {
  constructor(private membersRepository: IMembersRepository) {}

  async execute(
    dataExecute: UpdateMemberUseCaseRequest
  ): Promise<UpdateMemberUseCaseResponse> {
    const { data, memberId, organizationId } = dataExecute;

    const memberUpdated = await this.membersRepository.update(
      memberId,
      organizationId,
      data
    );

    return { member: memberUpdated };
  }
}

const makeWithPrismaUpdateMemberUseCase = () => {
  const membersRepository = new PrismaMembersRepository();
  const updateMemberUseCaseRequest = new UpdateMemberUseCase(membersRepository);
  return updateMemberUseCaseRequest;
};

export { makeWithPrismaUpdateMemberUseCase, UpdateMemberUseCase };
