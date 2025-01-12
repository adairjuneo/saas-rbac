import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { env } from '@/env';
import type { IMembersRepository } from '@/repositories/interfaces/members.interface';
import type { IOrganizationsRepository } from '@/repositories/interfaces/organizations.interface';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members.repository';
import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations.repository';
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
  constructor(
    private usersRepository: IUsersRepository,
    private membersRepository: IMembersRepository,
    private organizationsRepository: IOrganizationsRepository
  ) {}

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

    const [, domain] = email.split('@');

    if (domain) {
      const organization =
        await this.organizationsRepository.findByDomain(domain);

      if (organization?.shouldAttachUsersByDomain) {
        await this.membersRepository.createUserMemberOfOrganization(
          user.id,
          organization.id
        );
      }
    }

    return { user };
  }
}

const makeWithPrismaCreateUserUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const membersRepository = new PrismaMembersRepository();
  const organizationsRepository = new PrismaOrganizationsRepository();
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    membersRepository,
    organizationsRepository
  );

  return createUserUseCase;
};

export { CreateUserUseCase, makeWithPrismaCreateUserUseCase };
