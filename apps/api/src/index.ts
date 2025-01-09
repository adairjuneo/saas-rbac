import { ability } from '@saas-rbac/auth';

const userCanInviteSomoneElse = ability.can('invite', 'User');
const userCanDeleteOtherUsers = ability.can('delete', 'User');

console.info(userCanInviteSomoneElse);
console.info(userCanDeleteOtherUsers);
