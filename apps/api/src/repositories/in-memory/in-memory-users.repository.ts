import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import type { Prisma, User } from '@prisma/client';
import _ from 'lodash';

import type { IUsersRepository } from '../interfaces/users.interface';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserUncheckedCreateInput) {
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

  async updateUserPassword(id: string, passwordHash: string) {
    const userToChangePassword = this.items.find((item) => item.id === id);

    if (!userToChangePassword) return null;

    this.items.filter((item) => item.id === id);

    const index = _.findIndex(this.items, { id });

    const userWithNewPassword = { ...userToChangePassword, passwordHash };

    if (index !== -1) {
      this.items[index] = _.merge({}, this.items[index], userWithNewPassword);
    }

    return userWithNewPassword;
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
