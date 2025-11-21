import { z } from 'zod';

export const incomeSchema = z.object({
  primaryIncome: z.number().min(0, 'Income must be positive').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  primaryBonuses: z.number().min(0, 'Bonuses must be positive').default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }).describe("Primary Applicant Annual Bonuses"),
  otherIncome: z.number().min(0, 'Income must be positive').default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  otherBonuses: z.number().min(0, 'Bonuses must be positive').default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }).describe("Other Members Annual Bonuses"),
  workingMembersCount: z.number().min(1, 'At least one working member').int().refine(val => !isNaN(val), { message: "Please enter a valid number" }),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;
