import { BadRequestError } from '@/errors/bad-request.error';
import type { IInvitesRepository } from '@/repositories/interfaces/invites.interface';
import { PrismaInvitesRepository } from '@/repositories/prisma/prisma-invites.repository';

interface RevokeInviteUseCaseRequest {
  inviteId: string;
  organizationId: string;
}

class RevokeInviteUseCase {
  constructor(private invitesRepository: IInvitesRepository) {}

  async execute(dataExecute: RevokeInviteUseCaseRequest): Promise<void> {
    const { inviteId, organizationId } = dataExecute;

    const inviteFinded = await this.invitesRepository.findUnique({
      where: {
        id: inviteId,
        organizationId,
      },
    });

    if (!inviteFinded) {
      throw new BadRequestError('Invite not found or expired.');
    }

    await this.invitesRepository.delete({ where: { id: inviteId } });
  }
}

const makeWithPrismaRevokeInviteUseCase = () => {
  const invitesRepository = new PrismaInvitesRepository();

  const revokeInviteUseCase = new RevokeInviteUseCase(invitesRepository);
  return revokeInviteUseCase;
};

export { makeWithPrismaRevokeInviteUseCase, RevokeInviteUseCase };
