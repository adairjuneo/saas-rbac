import type { Role } from '@prisma/client';

import { BadRequestError } from '@/errors/bad-request.error';
import type {
  IInvitesRepository,
  InviteDTO,
} from '@/repositories/interfaces/invites.interface';
import type { IMembersRepository } from '@/repositories/interfaces/members.interface';
import { PrismaInvitesRepository } from '@/repositories/prisma/prisma-invites.repository';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';

interface CreateInviteUseCaseRequest {
  organizationId: string;
  authorId: string;
  email: string;
  role: Role;
}

interface CreateInviteUseCaseResponse {
  invite: InviteDTO;
}

class CreateInviteUseCase {
  constructor(
    private invitesRepository: IInvitesRepository,
    private membersRepository: IMembersRepository
  ) {}

  async execute(
    dataExecute: CreateInviteUseCaseRequest
  ): Promise<CreateInviteUseCaseResponse> {
    const { organizationId, authorId, email, role } = dataExecute;

    const inviteWithSameEmail = await this.invitesRepository.findUnique(
      email,
      organizationId
    );

    if (inviteWithSameEmail) {
      throw new BadRequestError(
        'Already exist another invite send to this e-mail for make part of this organization.'
      );
    }

    const memberWithSameEmail = await this.membersRepository.findFirst({
      where: { organizationId: organizationId, user: { email } },
    });

    if (memberWithSameEmail) {
      throw new BadRequestError(
        'A member with this e-mail already belongs to this organization.'
      );
    }

    const inviteCreated = await this.invitesRepository.create(
      organizationId,
      authorId,
      email,
      role
    );

    return { invite: inviteCreated };
  }
}

const makeWithPrismaCreateInviteUseCase = () => {
  const invitesRepository = new PrismaInvitesRepository();
  const membersRepository = new PrismaMembersRepository();
  const createInviteUseCase = new CreateInviteUseCase(
    invitesRepository,
    membersRepository
  );
  return createInviteUseCase;
};

export { CreateInviteUseCase, makeWithPrismaCreateInviteUseCase };
