import { type Token } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { ITokensRepository } from '../interfaces/tokens.interface';

export class PrismaTokensRepository implements ITokensRepository {
  async create(data: Token) {
    const token = await prisma.token.create({
      data,
    });

    return token;
  }

  async findById(id: string): Promise<Token | null> {
    const token = await prisma.token.findUnique({
      where: {
        id,
      },
    });

    return token;
  }
}
