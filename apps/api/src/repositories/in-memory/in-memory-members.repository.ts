import { randomUUID } from 'node:crypto';

import { type Member, Role } from '@prisma/client';

import type { IMembersRepository } from '../interfaces/members.interface';

export class InMemoryMembersRepository implements IMembersRepository {
  public items: Member[] = [];

  async findByUserId(userId: string): Promise<Member | null> {
    const member = this.items.find((item) => item.userId === userId);

    if (!member) {
      return null;
    }

    return member;
  }

  async findByOrganizationId(organizationId: string): Promise<Member | null> {
    const member = this.items.find(
      (item) => item.organizationId === organizationId
    );

    if (!member) {
      return null;
    }

    return member;
  }

  async createUserAdminOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member> {
    const member = {
      userId,
      organizationId,
      id: randomUUID(),
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(member);

    return member;
  }

  async createUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member> {
    const member = {
      userId,
      organizationId,
      id: randomUUID(),
      role: Role.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(member);

    return member;
  }
}
