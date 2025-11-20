import { z } from 'zod';

export const debtsSchema = z.object({
  studentLoans: z.number().min(0).default(0),
  creditCards: z.number().min(0).default(0),
  carLoans: z.number().min(0).default(0),
  carLoanEndDate: z.date().optional().describe("Date of last car loan payment"),
  otherLoans: z.number().min(0).default(0),
  existingSavings: z.number().min(0).default(0),
});

export type DebtsFormData = z.infer<typeof debtsSchema>;
