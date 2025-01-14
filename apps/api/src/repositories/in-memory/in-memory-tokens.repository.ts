import { randomUUID } from 'node:crypto';

import { type Token, TokenType } from '@prisma/client';

import type { ITokensRepository } from '../interfaces/tokens.interface';

export class InMemoryTokensRepository implements ITokensRepository {
  public items: Token[] = [];

  async create(data: Token) {
    const token = {
      id: randomUUID(),
      type: data.type ?? TokenType.PASSWORD_RECOVER,
      createdAt: new Date(),
      userId: data.userId ?? 'user-01',
    };

    this.items.push(token);

    return token;
  }

  async findById(id: string): Promise<Token | null> {
    const token = this.items.find((item) => item.id === id);

    if (!token) return null;

    return token;
  }
}
