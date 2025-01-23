import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import type {
  IInvitesRepository,
  InviteDTO,
} from '@/repositories/interfaces/invites.interface';
import { PrismaInvitesRepository } from '@/repositories/prisma/prisma-invites.repository';

interface ListInvitesOfOrganizationUseCaseRequest {
  organizationId: string;
}

interface ListInvitesOfOrganizationUseCaseResponse {
  invites: InviteDTO[];
}

class ListInvitesOfOrganizationUseCase {
  constructor(private invitesRepository: IInvitesRepository) {}

  async execute(
    dataExecute: ListInvitesOfOrganizationUseCaseRequest
  ): Promise<ListInvitesOfOrganizationUseCaseResponse> {
    const { organizationId } = dataExecute;

    const listOfInvites = await this.invitesRepository.listInvites({
      where: {
        organizationId,
      },
    });

    if (!listOfInvites) {
      throw new ResourceNotFoundError();
    }

    return { invites: listOfInvites };
  }
}

const makeWithPrismaListInvitesOfOrganizationUseCase = () => {
  const invitesRepository = new PrismaInvitesRepository();
  const listInvitesOfOrganizationUseCase = new ListInvitesOfOrganizationUseCase(
    invitesRepository
  );
  return listInvitesOfOrganizationUseCase;
};

export {
  ListInvitesOfOrganizationUseCase,
  makeWithPrismaListInvitesOfOrganizationUseCase,
};
