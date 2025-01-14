import type { User } from '@prisma/client';

import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface RequestPasswordRecoveryUseCaseRequest {
  email: string;
}

interface RequestPasswordRecoveryUseCaseResponse {
  user: User | null;
}

class RequestPasswordRecoveryUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(
    data: RequestPasswordRecoveryUseCaseRequest
  ): Promise<RequestPasswordRecoveryUseCaseResponse> {
    const { email } = data;

    const userFoundById = await this.usersRepository.findByEmail(email);

    if (!userFoundById) {
      return { user: null };
    }

    return { user: userFoundById };
  }
}

const makeWithPrismaRequestPasswordRecoveryUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const requestPasswordRecoveryUseCase = new RequestPasswordRecoveryUseCase(
    userRepository
  );

  return requestPasswordRecoveryUseCase;
};

export {
  makeWithPrismaRequestPasswordRecoveryUseCase,
  RequestPasswordRecoveryUseCase,
};
