import { z } from 'zod';

export const getExpensesSchema = (t: (key: string) => string) => z.object({
  utilities: z.number({ message: t('validNumber') }).min(0, t('positive')),
  insurance: z.number({ message: t('validNumber') }).min(0, t('positive')),
  lifeInsuranceDuration: z.number({ message: t('validNumber') }).min(0).default(0).describe("Duration in years for life insurance"),
  subscriptions: z.number({ message: t('validNumber') }).min(0, t('positive')),
  groceries: z.number({ message: t('validNumber') }).min(0, t('positive')),
  transportation: z.number({ message: t('validNumber') }).min(0, t('positive')),
  entertainment: z.number({ message: t('validNumber') }).min(0, t('positive')),
  other: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0),
});

export type ExpensesFormData = z.infer<ReturnType<typeof getExpensesSchema>>;
