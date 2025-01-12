import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { Organization, Prisma } from '@prisma/client';

import type { IOrganizationsRepository } from '../interfaces/organizations.interface';

export class InMemoryOrganizationsRepository
  implements IOrganizationsRepository
{
  public items: Organization[] = [];

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization = {
      id: randomUUID(),
      name: data?.name || faker.company.name(),
      avatarUrl: data?.avatarUrl || faker.image.avatar(),
      slug: data?.slug || faker.internet.domainWord(),
      domain: data?.domain || faker.internet.domainName(),
      shouldAttachUsersByDomain: data?.shouldAttachUsersByDomain || false,
      ownerId: 'user-id-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(organization);

    return organization;
  }

  async update(): Promise<Organization> {
    throw new Error('Method not implemented.');
  }

  async findById(): Promise<Organization | null> {
    throw new Error('Method not implemented.');
  }

  async findByDomain(domain: string): Promise<Organization | null> {
    const organization = this.items.find((item) =>
      item.domain?.includes(domain)
    );

    return organization || null;
  }
}
