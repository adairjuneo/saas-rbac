import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import { Role, type User } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

import { BadRequestError } from '@/errors/bad-request.error';
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-members.repository';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { CreateOrganizationUseCase } from './create-organization.usecase';

let usersRepository: InMemoryUsersRepository;
let membersRepository: InMemoryMembersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let createOrganizationUseCase: CreateOrganizationUseCase;
let userCreated: User;

describe('Create Organization Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    membersRepository = new InMemoryMembersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    createOrganizationUseCase = new CreateOrganizationUseCase(
      membersRepository,
      organizationsRepository
    );

    userCreated = await usersRepository.create({
      id: randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      avatarUrl: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should be able to create a new organization', async () => {
    const { organization } = await createOrganizationUseCase.execute({
      ownerId: userCreated.id,
      name: faker.company.name(),
      domain: faker.internet.domainName(),
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
    });

    expect(organization.id).toEqual(expect.any(String));
    expect(organization.slug).toEqual(expect.any(String));
  });

  it('should not be able to create two or more organizations with same domain', async () => {
    await createOrganizationUseCase.execute({
      ownerId: userCreated.id,
      name: faker.company.name(),
      domain: 'domain-tests.com',
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
    });

    await expect(
      createOrganizationUseCase.execute({
        ownerId: userCreated.id,
        name: faker.company.name(),
        domain: 'domain-tests.com',
        avatarUrl: faker.image.avatar(),
        shouldAttachUsersByDomain: true,
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should be able to get a member admin after create a new organization', async () => {
    const { organization } = await createOrganizationUseCase.execute({
      ownerId: userCreated.id,
      name: faker.company.name(),
      domain: faker.internet.domainName(),
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
    });

    const member = await membersRepository.findByOrganizationId(
      organization.id
    );

    expect(member?.id).toEqual(expect.any(String));
    expect(member?.role).toEqual(Role.ADMIN);
    expect(member?.userId).to.equal(organization.ownerId);
  });
});
