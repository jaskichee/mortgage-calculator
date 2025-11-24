import { z } from 'zod';

export const getInvestmentSchema = (t: (key: string) => string) => z.object({
  emergencyFundMonths: z.number({ message: t('validNumber') }).min(3).max(6),
  etfAllocation: z.number({ message: t('validNumber') }).min(0).max(100),
});

export type InvestmentFormData = z.infer<ReturnType<typeof getInvestmentSchema>>;
