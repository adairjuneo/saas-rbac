import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { CreateUserUseCase } from './create-user.usecase';

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

const userMock = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe('Create User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should be able to create a user', async () => {
    const { user } = await createUserUseCase.execute({ ...userMock });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await createUserUseCase.execute({
      ...userMock,
      password: '987654321',
    });

    const isPasswordCorrectlyHashed = await bcrypt.compare(
      '987654321',
      user.passwordHash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same e-mail twice', async () => {
    const email = 'john.doe@tests.com';

    await createUserUseCase.execute({ ...userMock, email });

    await expect(
      createUserUseCase.execute({ ...userMock, email })
    ).rejects.toBeInstanceOf(Error);
  });
});
