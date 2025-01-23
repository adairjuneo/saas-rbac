import type { Prisma, Role } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type {
  IInvitesRepository,
  InviteDTO,
} from '../interfaces/invites.interface';

export class PrismaInvitesRepository implements IInvitesRepository {
  async create(
    organizationId: string,
    authorId: string,
    email: string,
    role: Role
  ): Promise<InviteDTO> {
    const invite = await prisma.invite.create({
      data: {
        email,
        role,
        authorId,
        organizationId,
      },
      select: {
        id: true,
        role: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return invite;
  }

  async findUnique({
    where,
  }: {
    where: Prisma.InviteWhereUniqueInput;
  }): Promise<InviteDTO | null> {
    const invite = await prisma.invite.findUnique({
      where,
      select: {
        id: true,
        role: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return invite;
  }
}
