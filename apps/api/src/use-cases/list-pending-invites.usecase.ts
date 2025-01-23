import { BadRequestError } from '@/errors/bad-request.error';
import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import type {
  IInvitesRepository,
  InviteDTO,
} from '@/repositories/interfaces/invites.interface';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaInvitesRepository } from '@/repositories/prisma/prisma-invites.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface ListPendingInvitesUseCaseRequest {
  userId: string;
}

interface ListPendingInvitesUseCaseResponse {
  invites: InviteDTO[];
}

class ListPendingInvitesUseCase {
  constructor(
    private invitesRepository: IInvitesRepository,
    private usersRepository: IUsersRepository
  ) {}

  async execute(
    dataExecute: ListPendingInvitesUseCaseRequest
  ): Promise<ListPendingInvitesUseCaseResponse> {
    const { userId } = dataExecute;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new BadRequestError('User not found.');
    }

    const listOfInvites = await this.invitesRepository.listInvites({
      where: {
        email: user.email,
      },
    });

    if (!listOfInvites) {
      throw new ResourceNotFoundError();
    }

    return { invites: listOfInvites };
  }
}

const makeWithPrismaListPendingInvitesUseCase = () => {
  const invitesRepository = new PrismaInvitesRepository();
  const usersRepository = new PrismaUsersRepository();
  const listPendingInvitesUseCase = new ListPendingInvitesUseCase(
    invitesRepository,
    usersRepository
  );
  return listPendingInvitesUseCase;
};

export { ListPendingInvitesUseCase, makeWithPrismaListPendingInvitesUseCase };
