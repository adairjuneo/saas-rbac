import type { Prisma, User } from '@prisma/client';

export interface IUsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  updateUserPassword(id: string, passwordHash: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
