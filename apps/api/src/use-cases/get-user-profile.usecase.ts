import type { User } from '@prisma/client';

import { BadRequestError } from '@/errors/bad-request.error';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface GetUserProfileUseCaseRequest {
  id: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

class GetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(
    data: GetUserProfileUseCaseRequest
  ): Promise<GetUserProfileUseCaseResponse> {
    const { id } = data;

    const userFindById = await this.usersRepository.findById(id);

    if (!userFindById) {
      throw new BadRequestError('User does not exist.');
    }

    return { user: userFindById };
  }
}

const makeWithPrismaGetUserProfileUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

  return getUserProfileUseCase;
};

export { GetUserProfileUseCase, makeWithPrismaGetUserProfileUseCase };
