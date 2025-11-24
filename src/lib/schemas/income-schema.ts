import { z } from 'zod';

export const getIncomeSchema = (t: (key: string) => string) => z.object({
  primaryIncome: z.number({ message: t('validNumber') }).min(0, t('positive')),
  primaryBonuses: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0).describe("Primary Applicant Annual Bonuses"),
  otherIncome: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0),
  otherBonuses: z.number({ message: t('validNumber') }).min(0, t('positive')).default(0).describe("Other Members Annual Bonuses"),
  workingMembersCount: z.number({ message: t('validNumber') }).min(1, t('minWorkingMembers')).int(),
});

export type IncomeFormData = z.infer<ReturnType<typeof getIncomeSchema>>;
