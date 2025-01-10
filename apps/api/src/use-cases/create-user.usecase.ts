import type { IUsersRepository } from '@/repositories/interfaces/users.interface';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  user: object;
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(
    data: CreateUserUseCaseRequest
  ): Promise<CreateUserUseCaseResponse> {
    const { name, email, password } = data;

    return { user: { name, email, password } };
  }
}

const makeWithPrismaCreateUserUseCase = () => {
  // const userRepository = new PrismaUsersRepository();
  // const createUserUseCase = new CreateUserUseCase(userRepository);
  // return createUserUseCase;
};

export { CreateUserUseCase, makeWithPrismaCreateUserUseCase };
