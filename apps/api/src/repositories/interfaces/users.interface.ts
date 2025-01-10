export interface IUsersRepository {
  create(data: object): Promise<void>;
  findById(id: string): Promise<void>;
  findByEmail(email: string): Promise<void>;
}
