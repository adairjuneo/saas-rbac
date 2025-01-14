import type { Account, User } from '@prisma/client';
import { z } from 'zod';

import { BadRequestError } from '@/errors/bad-request.error';
import { env } from '@/lib/env';
import type { IAccountsRepository } from '@/repositories/interfaces/accounts.interface';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface AuthenticateWithGitHubUseCaseRequest {
  code: string | null;
}

interface AuthenticateWithGitHubUseCaseResponse {
  user: User;
  account: Account;
}

class AuthenticateWithGitHubUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private accountsRepository: IAccountsRepository
  ) {}

  async execute(
    data: AuthenticateWithGitHubUseCaseRequest
  ): Promise<AuthenticateWithGitHubUseCaseResponse> {
    const { code } = data;

    if (!code) {
      throw new BadRequestError(
        'Must be a provide secret code to authenticate with GitHub.'
      );
    }

    const githubOAuthURL = new URL(env.GITHUB_ACCESS_TOKEN_URL);

    githubOAuthURL.searchParams.set('code', code);
    githubOAuthURL.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    githubOAuthURL.searchParams.set('redirect_uri', env.GITHUB_REDIRECT_URL);
    githubOAuthURL.searchParams.set('client_secret', env.GITHUB_CLIENT_SECRET);

    const githubResponse = await fetch(githubOAuthURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    const githubResponseJson = await githubResponse.json();

    const { access_token: githubAccessToken } = z
      .object({
        access_token: z.string(),
        token_type: z.literal('bearer'),
        scope: z.string(),
      })
      .parse(githubResponseJson);

    const githubUserResponse = await fetch(env.GITHUB_USER_DATA_URL, {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
      },
    });

    const githubUserResponseJson = await githubUserResponse.json();

    const {
      id: githubId,
      name,
      email,
      avatar_url: avatarUrl,
    } = z
      .object({
        id: z.number().transform(String),
        avatar_url: z.string().url(),
        name: z.string().nullable(),
        email: z.string().nullable(),
      })
      .parse(githubUserResponseJson);

    if (!email) {
      throw new BadRequestError(
        'Your GitHub account must have an email to authenticate.'
      );
    }

    let user = await this.usersRepository.findByEmail(email);

    if (!user) {
      user = await this.usersRepository.create({
        name,
        email,
        avatarUrl,
      });
    }

    let account = await this.accountsRepository.findByProviderAndUserId(
      'GITHUB',
      user.id
    );

    if (!account) {
      account = await this.accountsRepository.create({
        provider: 'GITHUB',
        providerAccountId: githubId,
        userId: user.id,
      });
    }

    return { user, account };
  }
}

const makeWithPrismaAuthenticateWithGitHubUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const accountsRepository = new PrismaAccountsRepository();
  const authenticateWithGitHubUseCase = new AuthenticateWithGitHubUseCase(
    userRepository,
    accountsRepository
  );

  return authenticateWithGitHubUseCase;
};

export {
  AuthenticateWithGitHubUseCase,
  makeWithPrismaAuthenticateWithGitHubUseCase,
};
