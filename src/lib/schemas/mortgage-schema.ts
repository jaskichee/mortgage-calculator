import { z } from 'zod';

export const mortgageSchema = z.object({
  homePrice: z.number().min(1, 'Home price is required').refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  downPayment: z.number().min(0, 'Down payment cannot be negative').default(0).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  rateType: z.enum(['fixed', 'variable']).default('fixed'),
  interestRate: z.number().min(0.1, 'Interest rate must be positive').max(15, 'Interest rate seems too high').refine(val => !isNaN(val), { message: "Please enter a valid number" }).optional(), // For fixed
  euribor: z.number().min(-1).max(10).refine(val => !isNaN(val), { message: "Please enter a valid number" }).optional(), // For variable
  bankMargin: z.number().min(0).max(10).refine(val => !isNaN(val), { message: "Please enter a valid number" }).optional(), // For variable
  loanTerm: z.number().min(5, 'Minimum term is 5 years').max(30, 'Maximum term is 30 years').default(30).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
  useCollateral: z.boolean().default(false),
  additionalResourceMethod: z.enum(['collateral', 'consumerLoan', 'none']).default('none'),
  parentPropertyValue: z.number().refine(val => !isNaN(val), { message: "Please enter a valid number" }).optional(),
  consumerLoanInterestRate: z.number().min(0, 'Interest rate must be positive').max(20, 'Interest rate seems too high').refine(val => !isNaN(val), { message: "Please enter a valid number" }).optional(),
  consumerLoanTerm: z.number().min(1, 'Minimum term is 1 year').max(20, 'Maximum term is 20 years').default(10).refine(val => !isNaN(val), { message: "Please enter a valid number" }),
}).refine((data) => {
  if (data.useCollateral || data.additionalResourceMethod === 'collateral') {
    return data.parentPropertyValue !== undefined && data.parentPropertyValue > 0;
  }
  return true;
}, {
  message: "Collateral property value is required",
  path: ["parentPropertyValue"],
}).refine((data) => {
  if (data.additionalResourceMethod === 'consumerLoan') {
    return data.consumerLoanInterestRate !== undefined && data.consumerLoanInterestRate > 0;
  }
  return true;
}, {
  message: "Consumer loan interest rate is required",
  path: ["consumerLoanInterestRate"],
}).refine((data) => {
  if (data.downPayment > data.homePrice) {
    return false;
  }
  return true;
}, {
  message: "Down payment cannot exceed home price",
  path: ["downPayment"],
}).refine((data) => {
  if (data.rateType === 'fixed') {
    return data.interestRate !== undefined && data.interestRate > 0;
  }
  return true;
}, {
  message: "Fixed interest rate is required",
  path: ["interestRate"],
}).refine((data) => {
  if (data.rateType === 'variable') {
    return data.euribor !== undefined && data.bankMargin !== undefined;
  }
  return true;
}, {
  message: "EURIBOR and Bank Margin are required for variable rate",
  path: ["bankMargin"],
});

export type MortgageFormData = z.infer<typeof mortgageSchema>;
