import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryTokensRepository } from '@/repositories/in-memory/in-memory-tokens.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { RequestPasswordRecoveryUseCase } from './request-password-recovery.usecase';

let userRepository: InMemoryUsersRepository;
let tokensRepository: InMemoryTokensRepository;
let requestPasswordRecoveryUseCase: RequestPasswordRecoveryUseCase;
let userCreated: User;

describe('Request Password Recovery Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    tokensRepository = new InMemoryTokensRepository();
    requestPasswordRecoveryUseCase = new RequestPasswordRecoveryUseCase(
      userRepository,
      tokensRepository
    );

    userCreated = await userRepository.create({
      id: randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      avatarUrl: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should be able to get a user for recovery password', async () => {
    const { token } = await requestPasswordRecoveryUseCase.execute({
      email: userCreated.email,
    });

    expect(token?.id).toEqual(expect.any(String));
    expect(token?.userId).toEqual(expect.any(String));
  });

  it('should be able to get a NULL user for recovery password unexist email', async () => {
    const { token } = await requestPasswordRecoveryUseCase.execute({
      email: 'invalid-email@test.com',
    });

    expect(token).toEqual(null);
  });
});
