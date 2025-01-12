import { Prisma, type User } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { IUsersRepository } from '../interfaces/users.interface';

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async linkUserToOrganization(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
