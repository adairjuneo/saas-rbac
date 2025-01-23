import type { Prisma, Role } from '@prisma/client';
import { roleSchema } from '@saas-rbac/auth/src/roles';
import { z } from 'zod';

export const inviteSchema = z.object({
  id: z.string(),
  role: roleSchema,
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    })
    .nullable(),
  organization: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    })
    .nullable(),
});

export type InviteDTO = z.infer<typeof inviteSchema>;

export interface IInvitesRepository {
  create(
    organizationId: string,
    authorId: string,
    email: string,
    role: Role
  ): Promise<InviteDTO>;
  findUnique({
    where,
  }: {
    where: Prisma.InviteWhereUniqueInput;
  }): Promise<InviteDTO | null>;
}
