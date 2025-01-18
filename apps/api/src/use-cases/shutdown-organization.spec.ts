import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { Organization } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/errors/resource-not-found.error';
import { createSlug } from '@/lib/create-slug';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations.repository';

import { ShutdownOrganizationUseCase } from './shutdown-organization.usecase';

let organizationsRepository: InMemoryOrganizationsRepository;
let shutdownOrganizationUseCase: ShutdownOrganizationUseCase;
let lastOrganizationCreated: Organization;

describe('Shutdown Organization Use Case', () => {
  beforeEach(async () => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    shutdownOrganizationUseCase = new ShutdownOrganizationUseCase(
      organizationsRepository
    );

    const fakeDomain = faker.internet.domainName();

    await organizationsRepository.create({
      ownerId: randomUUID(),
      name: faker.company.name(),
      domain: fakeDomain,
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      slug: createSlug(fakeDomain),
    });

    await organizationsRepository.create({
      ownerId: randomUUID(),
      name: faker.company.name(),
      domain: fakeDomain,
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      slug: createSlug(fakeDomain),
    });

    lastOrganizationCreated = await organizationsRepository.create({
      ownerId: randomUUID(),
      name: faker.company.name(),
      domain: fakeDomain,
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      slug: createSlug(fakeDomain),
    });
  });

  it('should be able to shutdown existing organization', async () => {
    const { organizationHasBeenOff } =
      await shutdownOrganizationUseCase.execute({
        organizationId: lastOrganizationCreated.id,
      });

    expect(organizationHasBeenOff).toBeTruthy();
  });

  it('should no be able to shutdown non-existent organization', async () => {
    await expect(
      shutdownOrganizationUseCase.execute({
        organizationId: 'fake-id-testes',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
