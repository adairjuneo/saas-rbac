import type { Token } from '@prisma/client';

export interface ITokensRepository {
  create(data: Token): Promise<Token>;
  findById(id: string): Promise<Token | null>;
}
