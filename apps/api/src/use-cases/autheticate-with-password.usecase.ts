import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface AuthenticateWithPasswordUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateWithPasswordUseCaseResponse {
  user: User;
}

class AuthenticateWithPasswordUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(
    data: AuthenticateWithPasswordUseCaseRequest
  ): Promise<AuthenticateWithPasswordUseCaseResponse> {
    const { email, password } = data;

    const userFindByEmail = await this.usersRepository.findByEmail(email);

    if (!userFindByEmail) {
      throw new Error('Invalid credentials.');
    }

    if (userFindByEmail.passwordHash === null) {
      throw new Error('User does not have a password, user social login.');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userFindByEmail.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    return { user: userFindByEmail };
  }
}

const makeWithPrismaAuthenticateWithPasswordUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const authenticateWithPasswordUseCase = new AuthenticateWithPasswordUseCase(
    userRepository
  );

  return authenticateWithPasswordUseCase;
};

export {
  AuthenticateWithPasswordUseCase,
  makeWithPrismaAuthenticateWithPasswordUseCase,
};
