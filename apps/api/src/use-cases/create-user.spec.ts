import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { UserAlreadyExistsError } from '@/errors/user-already-exists.error';
import { comparePassword } from '@/lib/password';
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-members.repository';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { CreateUserUseCase } from './create-user.usecase';

let userRepository: InMemoryUsersRepository;
let membersRepository: InMemoryMembersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let createUserUseCase: CreateUserUseCase;

const userMock = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe('Create User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    membersRepository = new InMemoryMembersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      membersRepository,
      organizationsRepository
    );
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

    const isPasswordCorrectlyHashed = await comparePassword(
      '987654321',
      user.passwordHash || ''
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same e-mail twice', async () => {
    const email = 'john.doe@tests.com';

    await createUserUseCase.execute({ ...userMock, email });

    await expect(
      createUserUseCase.execute({ ...userMock, email })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should be able to link user in organization by domain', async () => {
    const email = 'john.doe@acme.com';

    organizationsRepository.items.push({
      id: randomUUID(),
      avatarUrl: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      name: 'Acme TESTS',
      domain: 'acme.com',
      ownerId: 'owner-id-test-01',
      slug: 'acme',
      shouldAttachUsersByDomain: true,
    });

    const { user: userOne } = await createUserUseCase.execute({
      ...userMock,
      email,
    });

    const { user: userTwo } = await createUserUseCase.execute({
      ...userMock,
      email: 'john.doe@randomtest.com',
    });

    const userAttachedOnOrganization = !!membersRepository.items.find(
      (item) => item.userId === userOne.id
    );

    const userNotAttachedOnOrganization = !!membersRepository.items.find(
      (item) => item.userId === userTwo.id
    );

    expect(userAttachedOnOrganization).toEqual(true);
    expect(userNotAttachedOnOrganization).toEqual(false);
  });
});
