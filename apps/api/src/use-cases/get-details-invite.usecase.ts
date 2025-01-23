import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import type {
  IInvitesRepository,
  InviteDTO,
} from '@/repositories/interfaces/invites.interface';
import { PrismaInvitesRepository } from '@/repositories/prisma/prisma-invites.repository';

interface GetDetailsInviteUseCaseRequest {
  inviteId: string;
}

interface GetDetailsInviteUseCaseResponse {
  invite: InviteDTO;
}

class GetDetailsInviteUseCase {
  constructor(private invitesRepository: IInvitesRepository) {}

  async execute(
    dataExecute: GetDetailsInviteUseCaseRequest
  ): Promise<GetDetailsInviteUseCaseResponse> {
    const { inviteId } = dataExecute;

    const inviteFinded = await this.invitesRepository.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!inviteFinded) {
      throw new ResourceNotFoundError();
    }

    return { invite: inviteFinded };
  }
}

const makeWithPrismaGetDetailsInviteUseCase = () => {
  const invitesRepository = new PrismaInvitesRepository();
  const getDetailsInviteUseCase = new GetDetailsInviteUseCase(
    invitesRepository
  );
  return getDetailsInviteUseCase;
};

export { GetDetailsInviteUseCase, makeWithPrismaGetDetailsInviteUseCase };
