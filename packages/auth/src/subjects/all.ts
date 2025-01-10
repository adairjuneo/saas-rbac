import { z } from 'zod';

export const allSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('')]),
  z.literal('all'),
]);

export type AllSubject = z.infer<typeof allSubject>;
