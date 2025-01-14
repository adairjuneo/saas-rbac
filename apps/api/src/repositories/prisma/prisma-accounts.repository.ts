import { type Account, type AccountProvider, Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { IAccountsRepository } from '../interfaces/accounts.interface';

export class PrismaAccountsRepository implements IAccountsRepository {
  async create(data: Prisma.AccountUncheckedCreateInput) {
    const account = await prisma.account.create({
      data,
    });

    return account;
  }

  async findByProviderAndUserId(
    provider: AccountProvider,
    userId: string
  ): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: {
        provider_userId: {
          provider,
          userId,
        },
      },
    });

    return account;
  }
}
