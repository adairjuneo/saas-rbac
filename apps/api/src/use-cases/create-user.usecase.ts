import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { env } from '@/env';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  user: User;
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(
    data: CreateUserUseCaseRequest
  ): Promise<CreateUserUseCaseResponse> {
    const { name, email, password } = data;

    const passwordHash = await bcrypt.hash(
      password,
      env.AUTH_SALT_PASSWORD_HASH
    );

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('User with same e-mail already exists.');
    }
    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    });

    return { user };
  }
}

const makeWithPrismaCreateUserUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  return createUserUseCase;
};

export { CreateUserUseCase, makeWithPrismaCreateUserUseCase };
