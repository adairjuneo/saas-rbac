import type { Role } from '@prisma/client';

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
      },
    });

    return invite;
  }

  async findUnique(
    organizationId: string,
    email: string
  ): Promise<InviteDTO | null> {
    const invite = await prisma.invite.findUnique({
      where: {
        email_organizationId: {
          email,
          organizationId,
        },
      },
      select: {
        id: true,
        role: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return invite;
  }
}
