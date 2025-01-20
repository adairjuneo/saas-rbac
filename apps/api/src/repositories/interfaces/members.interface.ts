import type { Member, Role } from '@prisma/client';

export interface IMembersRepository {
  findByUserId(userId: string): Promise<Member | null>;
  findUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member | null>;
  findByOrganizationId(organizationId: string): Promise<Member | null>;
  createUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member>;
  createUserAdminOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<Member>;
  updateMemberRoleOnOrganization(
    userId: string,
    organizationId: string,
    role: Role
  ): Promise<Member | null>;
}
