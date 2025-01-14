import { randomUUID } from 'node:crypto';

import type { Account, AccountProvider, Prisma } from '@prisma/client';

import type { IAccountsRepository } from '../interfaces/accounts.interface';

export class InMemoryAccountsRepository implements IAccountsRepository {
  public items: Account[] = [];

  async create(data: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    const account = {
      id: randomUUID(),
      userId: data.userId ?? 'user-id-tests',
      provider: data.provider ?? 'GITHUB',
      providerAccountId: data.providerAccountId ?? 'user-id-provider-tests',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(account);

    return account;
  }

  async findByProviderAndUserId(
    provider: AccountProvider,
    userId: string
  ): Promise<Account | null> {
    const account = this.items.find(
      (item) => item.userId === userId && item.provider === provider
    );

    if (!account) {
      return null;
    }

    return account;
  }
}
