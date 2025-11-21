import { z } from 'zod';

export const debtsSchema = z.object({
  studentLoans: z.number().min(0).default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  creditCards: z.number().min(0).default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  carLoans: z.number().min(0).default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  carLoanEndDate: z.date().optional().describe("Date of last car loan payment"),
  otherLoans: z.number().min(0).default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  existingSavings: z.number().min(0).default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
});

export type DebtsFormData = z.infer<typeof debtsSchema>;
