import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { Organization, User } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

import { BadRequestError } from '@/errors/bad-request.error';
import { createSlug } from '@/lib/create-slug';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { UpdateOrganizationUseCase } from './update-organization.usecase';

let usersRepository: InMemoryUsersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let updateOrganizationUseCase: UpdateOrganizationUseCase;
let userCreated: User;
let organizationCreated: Organization;

describe('Update Organization Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    updateOrganizationUseCase = new UpdateOrganizationUseCase(
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

    const fakeDomain = faker.internet.domainName();

    organizationCreated = await organizationsRepository.create({
      ownerId: userCreated.id,
      name: faker.company.name(),
      domain: fakeDomain,
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      slug: createSlug(fakeDomain),
    });
  });

  it('should be able to update an existing organization', async () => {
    const { organization } = await updateOrganizationUseCase.execute({
      organizationId: organizationCreated.id,
      name: faker.company.name(),
      domain: faker.internet.domainName(),
      shouldAttachUsersByDomain: false,
    });

    expect(organization.id).toEqual(expect.any(String));
    expect(organization.slug).toEqual(expect.any(String));
    expect(organization.name).not.equal(organizationCreated.name);
    expect(organization.domain).not.equal(organizationCreated.domain);
    expect(organization.shouldAttachUsersByDomain).toBeFalsy();
  });

  it('should not be able to update an non-existent organization', async () => {
    await expect(
      updateOrganizationUseCase.execute({
        organizationId: 'id-non-existent-test',
        name: faker.company.name(),
        domain: faker.internet.domainName(),
        shouldAttachUsersByDomain: true,
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should be able to update a domain of existing organization with the same id', async () => {
    const domainFekeTest = 'google-test.com';

    const secondOrganizationCreated = await organizationsRepository.create({
      ownerId: userCreated.id,
      name: faker.company.name(),
      domain: domainFekeTest,
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      slug: createSlug(domainFekeTest),
    });

    const { organization } = await updateOrganizationUseCase.execute({
      organizationId: secondOrganizationCreated.id,
      name: faker.company.name(),
      domain: faker.internet.domainName(),
      shouldAttachUsersByDomain: false,
    });

    expect(organization.id).equal(secondOrganizationCreated.id);
    expect(organization.slug).equal(secondOrganizationCreated.slug);
    expect(organization.domain).not.equal(secondOrganizationCreated.domain);
  });

  it('should be not able to update an existing organization with domain of another', async () => {
    const domainFekeTest = 'google-test.com';

    await organizationsRepository.create({
      ownerId: userCreated.id,
      name: faker.company.name(),
      domain: domainFekeTest,
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      slug: createSlug(domainFekeTest),
    });

    await expect(
      updateOrganizationUseCase.execute({
        organizationId: organizationCreated.id,
        name: faker.company.name(),
        domain: domainFekeTest,
        shouldAttachUsersByDomain: false,
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
