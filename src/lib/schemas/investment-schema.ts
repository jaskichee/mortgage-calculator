import { z } from 'zod';

export const investmentSchema = z.object({
  emergencyFundMonths: z.number().min(3).max(6),
  etfAllocation: z.number().min(0).max(100),
});

export type InvestmentFormData = z.infer<typeof investmentSchema>;
