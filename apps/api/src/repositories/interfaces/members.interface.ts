import type { Member } from '@prisma/client';

export interface IMembersRepository {
  findByUserId(userId: string): Promise<Member | null>;
  findByOrganizationId(organizationId: string): Promise<Member | null>;
  createUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member>;
  createUserAdminOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member>;
}
