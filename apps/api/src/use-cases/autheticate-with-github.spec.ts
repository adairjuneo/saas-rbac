import { beforeEach, describe, expect, it } from 'vitest';

import { BadRequestError } from '@/errors/bad-request.error';
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';

import { AuthenticateWithGitHubUseCase } from './autheticate-with-github.usecase';

let userRepository: InMemoryUsersRepository;
let accountsRepository: InMemoryAccountsRepository;
let authenticateWithGitHubUseCase: AuthenticateWithGitHubUseCase;

describe('Autheticate User With GitHub Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    accountsRepository = new InMemoryAccountsRepository();
    authenticateWithGitHubUseCase = new AuthenticateWithGitHubUseCase(
      userRepository,
      accountsRepository
    );
  });

  it('should be able to reject a request if code is not provide', async () => {
    await expect(
      authenticateWithGitHubUseCase.execute({
        code: null,
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
