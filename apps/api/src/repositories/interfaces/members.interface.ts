import type { Member } from '@prisma/client';

export interface IMembersRepository {
  createUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member>;
}
