import { z } from 'zod';

export const getChildSchema = (t: (key: string) => string) => z.object({
  birthDate: z.date({
    message: t('required'),
  }),
});

export const getChildrenSchema = (t: (key: string) => string) => z.object({
  children: z.array(getChildSchema(t)),
});

export type ChildrenFormData = z.infer<ReturnType<typeof getChildrenSchema>>;
