import type { Member, Prisma, Role } from '@prisma/client';
import { roleSchema } from '@saas-rbac/auth/src/roles';
import { z } from 'zod';

export const membersSchema = z.object({
  id: z.string(),
  role: roleSchema,
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    avatarUrl: z.string().nullable(),
  }),
});

export const createUpdateMembersSchema = z.object({
  role: roleSchema,
});

export type MemberDTO = z.infer<typeof membersSchema>;
export type CreateUpdateMemberDTO = z.infer<typeof createUpdateMembersSchema>;

export interface IMembersRepository {
  create(
    memberId: string,
    organizationId: string,
    role: Role
  ): Promise<MemberDTO>;
  update(
    memberId: string,
    organizationId: string,
    data: CreateUpdateMemberDTO
  ): Promise<MemberDTO>;
  removeOfOrganization(memberId: string, organizationId: string): Promise<void>;
  findMany(organizationId: string): Promise<MemberDTO[] | null>;
  findFirst({
    where,
  }: {
    where: Prisma.MemberWhereInput;
  }): Promise<MemberDTO | null>;
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
