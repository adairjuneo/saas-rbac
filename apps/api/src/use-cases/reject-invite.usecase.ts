import { BadRequestError } from '@/errors/bad-request.error';
import type { IInvitesRepository } from '@/repositories/interfaces/invites.interface';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaInvitesRepository } from '@/repositories/prisma/prisma-invites.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface RejectInviteUseCaseRequest {
  userId: string;
  inviteId: string;
}

class RejectInviteUseCase {
  constructor(
    private invitesRepository: IInvitesRepository,
    private usersRepository: IUsersRepository
  ) {}

  async execute(dataExecute: RejectInviteUseCaseRequest): Promise<void> {
    const { userId, inviteId } = dataExecute;

    const inviteFinded = await this.invitesRepository.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!inviteFinded || !inviteFinded.organization?.id) {
      throw new BadRequestError('Invite not found or expired.');
    }

    const userFinded = await this.usersRepository.findById(userId);

    if (!userFinded) {
      throw new BadRequestError('User not found.');
    }

    if (inviteFinded.email !== userFinded.email) {
      throw new BadRequestError('This invite belongs to another User.');
    }

    await this.invitesRepository.delete({ where: { id: inviteId } });
  }
}

const makeWithPrismaRejectInviteUseCase = () => {
  const invitesRepository = new PrismaInvitesRepository();
  const usersRepository = new PrismaUsersRepository();

  const rejectInviteUseCase = new RejectInviteUseCase(
    invitesRepository,
    usersRepository
  );
  return rejectInviteUseCase;
};

export { makeWithPrismaRejectInviteUseCase, RejectInviteUseCase };
