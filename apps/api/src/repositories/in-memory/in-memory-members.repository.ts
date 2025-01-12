import { randomUUID } from 'node:crypto';

import { type Member, Role } from '@prisma/client';

import type { IMembersRepository } from '../interfaces/members.interface';

export class InMemoryMembersRepository implements IMembersRepository {
  public items: Member[] = [];

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
