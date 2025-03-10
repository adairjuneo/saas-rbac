import { type Member, type Prisma, type Role } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type {
  CreateUpdateMemberDTO,
  IMembersRepository,
  MemberDTO,
} from '../interfaces/members.interface';

export class PrismaMembersRepository implements IMembersRepository {
  async create(
    memberId: string,
    organizationId: string,
    role: Role
  ): Promise<MemberDTO> {
    const member = await prisma.member.create({
      data: {
        userId: memberId,
        organizationId,
        role,
      },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return member;
  }

  async update(
    memberId: string,
    organizationId: string,
    data: CreateUpdateMemberDTO
  ): Promise<MemberDTO> {
    const member = await prisma.member.update({
      where: {
        id: memberId,
        organizationId,
      },
      data: {
        role: data.role,
      },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return member;
  }

  async count({ where }: { where: Prisma.MemberWhereInput }): Promise<number> {
    const amount = await prisma.member.count({ where });

    return amount;
  }

  async removeOfOrganization(
    memberId: string,
    organizationId: string
  ): Promise<void> {
    await prisma.member.delete({
      where: {
        id: memberId,
        organizationId,
      },
    });
  }

  async findMany(organizationId: string): Promise<MemberDTO[] | null> {
    const members = await prisma.member.findMany({
      where: { organizationId },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        role: 'asc',
      },
    });

    return members;
  }

  async findFirst({
    where,
  }: {
    where: Prisma.MemberWhereInput;
  }): Promise<MemberDTO | null> {
    const members = await prisma.member.findFirst({
      where,
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        role: 'asc',
      },
    });

    return members;
  }

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

  async findUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member | null> {
    const member = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    return member;
  }

  async updateMemberRoleOnOrganization(
    userId: string,
    organizationId: string,
    role: Role
  ): Promise<Member | null> {
    const member = await prisma.member.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      data: {
        role,
      },
    });

    return member;
  }
}
