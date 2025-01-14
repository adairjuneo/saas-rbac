import { Prisma, Token } from '@prisma/client';

export interface ITokensRepository {
  create(data: Prisma.TokenUncheckedCreateInput): Promise<Token>;
  findById(id: string): Promise<Token | null>;
}
