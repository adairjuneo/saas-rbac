import { BadRequestError } from '@/errors/bad-request.error';
import type { IInvitesRepository } from '@/repositories/interfaces/invites.interface';
import type { IMembersRepository } from '@/repositories/interfaces/members.interface';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaInvitesRepository } from '@/repositories/prisma/prisma-invites.repository';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface AcceptInviteUseCaseRequest {
  userId: string;
  inviteId: string;
}

class AcceptInviteUseCase {
  constructor(
    private invitesRepository: IInvitesRepository,
    private usersRepository: IUsersRepository,
    private membersRepository: IMembersRepository
  ) {}

  async execute(dataExecute: AcceptInviteUseCaseRequest): Promise<void> {
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

    await this.membersRepository.create(
      userId,
      inviteFinded.organization?.id,
      inviteFinded.role
    );

    await this.invitesRepository.delete({ where: { id: inviteId } });
  }
}

const makeWithPrismaAcceptInviteUseCase = () => {
  const invitesRepository = new PrismaInvitesRepository();
  const usersRepository = new PrismaUsersRepository();
  const membersRepository = new PrismaMembersRepository();
  const acceptInviteUseCase = new AcceptInviteUseCase(
    invitesRepository,
    usersRepository,
    membersRepository
  );
  return acceptInviteUseCase;
};

export { AcceptInviteUseCase, makeWithPrismaAcceptInviteUseCase };
