import { AbilityBuilder, CreateAbility, createMongoAbility, ForcedSubject, MongoAbility } from '@casl/ability';

type actions = ['manage', 'invite', 'delete'];
type subjects = ['User', 'all'];
type AppAbilities = [actions[number], subjects[number] | ForcedSubject<Exclude<subjects[number], 'all'>>];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

const { build, can, cannot } = new AbilityBuilder(createAppAbility);

can('invite', 'User');
cannot('delete', 'User');

export const ability = build();
