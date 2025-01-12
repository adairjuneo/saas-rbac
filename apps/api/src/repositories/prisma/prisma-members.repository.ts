import { type Member } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { IMembersRepository } from '../interfaces/members.interface';

export class PrismaMembersRepository implements IMembersRepository {
  async createUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member> {
    const member = await prisma.member.create({
      data: {
        userId,
        organizationId,
      },
    });

    return member;
  }
}
