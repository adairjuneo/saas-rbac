import type { Account, AccountProvider, Prisma } from '@prisma/client';

export interface IAccountsRepository {
  create(data: Prisma.AccountUncheckedCreateInput): Promise<Account>;
  findByProviderAndUserId(
    provider: AccountProvider,
    userId: string
  ): Promise<Account | null>;
}
