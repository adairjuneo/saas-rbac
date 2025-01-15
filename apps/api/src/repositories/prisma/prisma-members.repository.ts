import { type Member } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { IMembersRepository } from '../interfaces/members.interface';

export class PrismaMembersRepository implements IMembersRepository {
  async findByUserId(userId: string): Promise<Member | null> {
    const member = await prisma.member.findFirst({
      where: {
        userId,
      },
    });

    return member;
  }

  async findByOrganizationId(organizationId: string): Promise<Member | null> {
    const member = await prisma.member.findFirst({
      where: {
        organizationId,
      },
    });

    return member;
  }

  async createUserAdminOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member> {
    const member = await prisma.member.create({
      data: {
        userId,
        organizationId,
        role: 'ADMIN',
      },
    });

    return member;
  }

  async createUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member> {
    const member = await prisma.member.create({
      data: {
        userId,
        organizationId,
        role: 'MEMBER',
      },
    });

    return member;
  }
}
