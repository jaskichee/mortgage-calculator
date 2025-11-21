import { z } from 'zod';

export const expensesSchema = z.object({
  utilities: z.number().min(0, 'Must be positive').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  insurance: z.number().min(0, 'Must be positive').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  lifeInsuranceDuration: z.number().min(0).default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }).describe("Duration in years for life insurance"),
  subscriptions: z.number().min(0, 'Must be positive').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  groceries: z.number().min(0, 'Must be positive').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  transportation: z.number().min(0, 'Must be positive').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  entertainment: z.number().min(0, 'Must be positive').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  other: z.number().min(0, 'Must be positive').default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
});

export type ExpensesFormData = z.infer<typeof expensesSchema>;
