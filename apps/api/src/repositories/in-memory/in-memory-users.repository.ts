import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { Prisma, User } from '@prisma/client';

import type { IUsersRepository } from '../interfaces/users.interface';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name || faker.person.fullName(),
      email: data.email || faker.internet.email(),
      passwordHash: data.passwordHash || faker.internet.password(),
      avatarUrl: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) return null;

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);

    if (!user) return null;

    return user;
  }
}
