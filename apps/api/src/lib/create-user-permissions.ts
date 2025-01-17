import type { Role } from '@prisma/client';
import { defineAbilityFor, userSchema } from '@saas-rbac/auth';

export const createUserPermissions = (userId: string, role: Role) => {
  const authUser = userSchema.parse({ id: userId, role });

  return defineAbilityFor(authUser);
};
