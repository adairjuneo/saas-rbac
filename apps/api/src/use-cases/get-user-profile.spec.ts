import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

import { BadRequestError } from '@/errors/bad-request.error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { GetUserProfileUseCase } from './get-user-profile.usecase';

let userRepository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;
let userCreated: User;

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

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

  it('should be able to get a user profile', async () => {
    const { user } = await getUserProfileUseCase.execute({
      id: userCreated.id,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to get a user profile by unexist id', async () => {
    await expect(
      getUserProfileUseCase.execute({
        id: 'unexist-id',
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
