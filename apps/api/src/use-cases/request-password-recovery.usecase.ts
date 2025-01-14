import type { Token } from '@prisma/client';

import type { ITokensRepository } from '@/repositories/interfaces/tokens.interface';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaTokensRepository } from '@/repositories/prisma/prisma-tokens.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface RequestPasswordRecoveryUseCaseRequest {
  email: string;
}

interface RequestPasswordRecoveryUseCaseResponse {
  token: Token | null;
}

class RequestPasswordRecoveryUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository
  ) {}

  async execute(
    data: RequestPasswordRecoveryUseCaseRequest
  ): Promise<RequestPasswordRecoveryUseCaseResponse> {
    const { email } = data;

    const userFoundById = await this.usersRepository.findByEmail(email);

    if (!userFoundById) {
      return { token: null };
    }

    const token = await this.tokensRepository.create({
      userId: userFoundById.id,
      type: 'PASSWORD_RECOVER',
    });

    return { token };
  }
}

const makeWithPrismaRequestPasswordRecoveryUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const requestPasswordRecoveryUseCase = new RequestPasswordRecoveryUseCase(
    userRepository,
    tokensRepository
  );

  return requestPasswordRecoveryUseCase;
};

export {
  makeWithPrismaRequestPasswordRecoveryUseCase,
  RequestPasswordRecoveryUseCase,
};
