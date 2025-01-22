import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import type {
  IMembersRepository,
  MemberDTO,
} from '@/repositories/interfaces/members.interface';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';

interface ListMembersUseCaseRequest {
  organizationId: string;
}

interface ListMembersUseCaseResponse {
  members: MemberDTO[];
}

class ListMembersUseCase {
  constructor(private membersRepository: IMembersRepository) {}

  async execute(
    data: ListMembersUseCaseRequest
  ): Promise<ListMembersUseCaseResponse> {
    const { organizationId } = data;

    const listOfMembers = await this.membersRepository.findMany(organizationId);

    if (!listOfMembers) {
      throw new ResourceNotFoundError();
    }

    return { members: listOfMembers };
  }
}

const makeWithPrismaListMembersUseCase = () => {
  const projectsRepository = new PrismaMembersRepository();
  const getProjectDetailsUseCase = new ListMembersUseCase(projectsRepository);

  return getProjectDetailsUseCase;
};

export { ListMembersUseCase, makeWithPrismaListMembersUseCase };
