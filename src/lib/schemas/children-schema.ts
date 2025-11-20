import { z } from 'zod';

export const childSchema = z.object({
  birthDate: z.date({
    message: "Birth date is required",
  }),
});

export const childrenSchema = z.object({
  children: z.array(childSchema),
});

export type ChildrenFormData = z.infer<typeof childrenSchema>;
