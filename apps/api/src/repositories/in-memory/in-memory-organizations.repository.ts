import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { Organization, Prisma } from '@prisma/client';
import _ from 'lodash';

import type { IOrganizationsRepository } from '../interfaces/organizations.interface';

export class InMemoryOrganizationsRepository
  implements IOrganizationsRepository
{
  public items: Organization[] = [];

  async create(
    data: Prisma.OrganizationUncheckedCreateInput
  ): Promise<Organization> {
    const organization = {
      id: randomUUID(),
      name: data?.name || faker.company.name(),
      avatarUrl: data?.avatarUrl || faker.image.avatar(),
      slug: data?.slug || faker.internet.domainWord(),
      domain: data?.domain || faker.internet.domainName(),
      shouldAttachUsersByDomain: data?.shouldAttachUsersByDomain || false,
      ownerId: data.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(organization);

    return organization;
  }

  async update(
    organizationId: string,
    data: {
      name?: string;
      domain?: string;
      shouldAttachUsersByDomain?: boolean;
    }
  ): Promise<Organization | null> {
    const organizationToUpdate = this.items.find(
      (item) => item.id === organizationId
    );

    if (!organizationToUpdate) return null;

    this.items.filter((item) => item.id === organizationId);

    const index = _.findIndex(this.items, { id: organizationId });

    const organizationUpdated = { ...organizationToUpdate, ...data };

    if (index !== -1) {
      this.items[index] = _.merge({}, this.items[index], organizationUpdated);
    }

    return organizationUpdated;
  }

  async findById(id: string): Promise<Organization | null> {
    const organization = this.items.find((item) => item.id === id);

    if (!organization) return null;

    return organization;
  }

  async findByDomain(domain: string): Promise<Organization | null> {
    const organization = this.items.find((item) =>
      item.domain?.includes(domain)
    );

    return organization || null;
  }

  async shutdownOrganizationById(organizationId: string): Promise<void | null> {
    const organization = this.items.findIndex(
      (item) => item.id === organizationId
    );

    if (organization < 0) {
      return null;
    }

    this.items.slice(organization);
  }

  async transferOwnerOfOrganization(
    organizationId: string,
    userId: string
  ): Promise<Organization | null> {
    const organizationIndex = this.items.findIndex(
      (item) => item.id === organizationId
    );

    let organizationUpdated = this.items[organizationIndex];

    this.items.map((organization) => {
      if (organization.id === organizationId) {
        organizationUpdated = { ...organization, ownerId: userId };
        return organizationUpdated;
      } else {
        return { ...organization };
      }
    });

    if (!organizationUpdated) {
      return null;
    }

    return organizationUpdated;
  }
}
