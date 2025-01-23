import type { Role } from '@prisma/client';
import { roleSchema } from '@saas-rbac/auth/src/roles';
import { z } from 'zod';

export const inviteSchema = z.object({
  id: z.string(),
  role: roleSchema,
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InviteDTO = z.infer<typeof inviteSchema>;

export interface IInvitesRepository {
  create(
    organizationId: string,
    authorId: string,
    email: string,
    role: Role
  ): Promise<InviteDTO>;
  findUnique(email: string, organizationId: string): Promise<InviteDTO | null>;
}
