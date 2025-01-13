import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { env } from '@/env';
import { InvalidCredentialsError } from '@/errors/invalid-credentials.error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { AuthenticateWithPasswordUseCase } from './autheticate-with-password.usecase';

let userRepository: InMemoryUsersRepository;
let authenticateWithPasswordUseCase: AuthenticateWithPasswordUseCase;

const userMock: User = {
  id: randomUUID(),
  name: faker.person.fullName(),
  email: 'john.doe@tests.com',
  passwordHash: '123456',
  avatarUrl: faker.image.avatar(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Autheticate User With Password Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    authenticateWithPasswordUseCase = new AuthenticateWithPasswordUseCase(
      userRepository
    );

    const passwordHash = await bcrypt.hash(
      userMock.passwordHash,
      env.AUTH_SALT_PASSWORD_HASH
    );

    await userRepository.create({ ...userMock, passwordHash });
  });

  it('should be able to get a user by email and password', async () => {
    const { user } = await authenticateWithPasswordUseCase.execute({
      email: userMock.email,
      password: userMock.passwordHash,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to get a user profile by wrong email', async () => {
    await expect(
      authenticateWithPasswordUseCase.execute({
        email: 'invalid.mail@tests.com',
        password: userMock.passwordHash,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to get a user profile by wrong password', async () => {
    await expect(
      authenticateWithPasswordUseCase.execute({
        email: userMock.email,
        password: '99999999999999',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
