import { defineAbilityFor } from '@saas-rbac/auth';

const ability = defineAbilityFor({ id: '', role: 'ADMIN' });

const userCanInviteSomoneElse = ability.can('get', 'User');
const userCanDeleteOtherUsers = ability.can('delete', 'User');

console.info(userCanInviteSomoneElse);
console.info(userCanDeleteOtherUsers);
