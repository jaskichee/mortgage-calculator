import { z } from 'zod';

export const incomeSchema = z.object({
  primaryIncome: z.number().min(0, 'Income must be positive'),
  primaryBonuses: z.number().min(0, 'Bonuses must be positive').default(0).describe("Primary Applicant Annual Bonuses"),
  otherIncome: z.number().min(0, 'Income must be positive').default(0),
  otherBonuses: z.number().min(0, 'Bonuses must be positive').default(0).describe("Other Members Annual Bonuses"),
  workingMembersCount: z.number().min(1, 'At least one working member').int(),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;
