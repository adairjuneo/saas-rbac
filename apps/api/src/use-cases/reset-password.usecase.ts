import type { User } from '@prisma/client';

import { BadRequestError } from '@/errors/bad-request.error';
import { hashPassword } from '@/lib/password';
import type { ITokensRepository } from '@/repositories/interfaces/tokens.interface';
import type { IUsersRepository } from '@/repositories/interfaces/users.interface';
import { PrismaTokensRepository } from '@/repositories/prisma/prisma-tokens.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

interface ResetPasswordUseCaseRequest {
  code: string;
  password: string;
}

interface ResetPasswordUseCaseResponse {
  user: User;
}

class ResetPasswordUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository
  ) {}

  async execute(
    data: ResetPasswordUseCaseRequest
  ): Promise<ResetPasswordUseCaseResponse> {
    const { code, password } = data;

    const codeIsValid = await this.tokensRepository.findById(code);

    if (!codeIsValid) {
      throw new BadRequestError('Token provide for reset password is invalid.');
    }

    const passwordHash = await hashPassword(password);

    const userChangedPasswordById =
      await this.usersRepository.updateUserPassword(
        codeIsValid.userId,
        passwordHash
      );

    if (!userChangedPasswordById) {
      throw new BadRequestError('Unexpected error at try reset password.');
    }

    return { user: userChangedPasswordById };
  }
}

const makeWithPrismaResetPasswordUseCase = () => {
  const userRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const resetPasswordUseCase = new ResetPasswordUseCase(
    userRepository,
    tokensRepository
  );

  return resetPasswordUseCase;
};

export { makeWithPrismaResetPasswordUseCase, ResetPasswordUseCase };
