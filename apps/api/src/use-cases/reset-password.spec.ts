import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { Token, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { env } from '@/env';
import { BadRequestError } from '@/errors/bad-request.error';
import { InMemoryTokensRepository } from '@/repositories/in-memory/in-memory-tokens.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { ResetPasswordUseCase } from './reset-password.usecase';

let userRepository: InMemoryUsersRepository;
let tokensRepository: InMemoryTokensRepository;
let resetPasswordUseCase: ResetPasswordUseCase;
let userCreated: User;
let tokenCreated: Token;
const passwordForTest = '231987642';

describe('Reset Password Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    tokensRepository = new InMemoryTokensRepository();
    resetPasswordUseCase = new ResetPasswordUseCase(
      userRepository,
      tokensRepository
    );

    const passwordHash = await bcrypt.hash(
      '99999999999999',
      env.AUTH_SALT_PASSWORD_HASH
    );

    userCreated = await userRepository.create({
      id: randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash,
      avatarUrl: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tokenCreated = await tokensRepository.create({
      id: randomUUID(),
      userId: userCreated.id,
      type: 'PASSWORD_RECOVER',
      createdAt: new Date(),
    });
  });

  it('should be able to reset password for user with a valid code', async () => {
    const { user } = await resetPasswordUseCase.execute({
      userId: userCreated.id,
      code: tokenCreated.id,
      password: passwordForTest,
    });

    const passwordsIsTheSame = await bcrypt.compare(
      passwordForTest,
      userCreated.passwordHash
    );

    expect(user?.id).toEqual(expect.any(String));
    expect(user?.email).toEqual(expect.any(String));
    expect(user?.passwordHash).toEqual(expect.any(String));
    expect(passwordsIsTheSame).toBeFalsy();
    expect(user.passwordHash).not.toEqual(userCreated.passwordHash);
  });

  it('should not be able to reset password for user with a invalid code', async () => {
    await expect(
      resetPasswordUseCase.execute({
        userId: userCreated.id,
        code: 'invalid-code',
        password: passwordForTest,
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to reset password for invalid userId', async () => {
    await expect(
      resetPasswordUseCase.execute({
        userId: 'invalid-user-id',
        code: tokenCreated.id,
        password: passwordForTest,
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
