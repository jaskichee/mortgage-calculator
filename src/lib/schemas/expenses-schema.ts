import { z } from 'zod';

export const expensesSchema = z.object({
  utilities: z.number().min(0, 'Must be positive'),
  insurance: z.number().min(0, 'Must be positive'),
  lifeInsuranceDuration: z.number().min(0).default(0).describe("Duration in years for life insurance"),
  subscriptions: z.number().min(0, 'Must be positive'),
  groceries: z.number().min(0, 'Must be positive'),
  transportation: z.number().min(0, 'Must be positive'),
  entertainment: z.number().min(0, 'Must be positive'),
  other: z.number().min(0, 'Must be positive').default(0),
});

export type ExpensesFormData = z.infer<typeof expensesSchema>;
