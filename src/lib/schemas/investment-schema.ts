import { z } from 'zod';

export const investmentSchema = z.object({
  emergencyFundMonths: z.number().min(3).max(6).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  etfAllocation: z.number().min(0).max(100).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
});

export type InvestmentFormData = z.infer<typeof investmentSchema>;
