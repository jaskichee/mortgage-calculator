import { z } from 'zod';

export const getDebtsSchema = (t: (key: string) => string) => z.object({
  studentLoans: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0),
  creditCards: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0),
  carLoans: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0),
  carLoanEndDate: z.date().optional().describe("Date of last car loan payment"),
  otherLoans: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0),
  existingSavings: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0),
});

export type DebtsFormData = z.infer<ReturnType<typeof getDebtsSchema>>;
