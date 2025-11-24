import { z } from 'zod';

export const getMortgageSchema = (t: (key: string, values?: Record<string, string | number | Date>) => string) => z.object({
  homePrice: z.number({ message: t('validNumber') }).min(10000, t('minHomePrice')),
  downPayment: z.number({ message: t('validNumber') }).min(0, t('minDownPayment')).default(0),
  rateType: z.enum(['fixed', 'variable']).default('fixed'),
  interestRate: z.number({ message: t('validNumber') }).min(0.1, t('minInterestRate')).max(15, t('maxInterestRate')).optional(), // For fixed
  euribor: z.number({ message: t('validNumber') }).min(-1).max(10).optional(), // For variable
  bankMargin: z.number({ message: t('validNumber') }).min(0).max(10).optional(), // For variable
  loanTerm: z.number({ message: t('validNumber') }).min(5, t('minLoanTerm', { years: 5 })).max(30, t('maxLoanTerm', { years: 30 })).default(30),
  useCollateral: z.boolean().default(false),
  additionalResourceMethod: z.enum(['collateral', 'consumerLoan', 'guarantor', 'none']).default('none'),
  parentPropertyValue: z.number({ message: t('validNumber') }).default(0),
  consumerLoanInterestRate: z.number({ message: t('validNumber') }).min(0, t('minInterestRate')).max(20, t('maxInterestRate')).optional(),
  consumerLoanTerm: z.number({ message: t('validNumber') }).min(1, t('minLoanTerm', { years: 1 })).max(20, t('maxLoanTerm', { years: 20 })).default(10),
}).refine((data) => {
  if (data.useCollateral || data.additionalResourceMethod === 'collateral' || data.additionalResourceMethod === 'guarantor') {
    return data.parentPropertyValue !== undefined && data.parentPropertyValue > 0;
  }
  return true;
}, {
  message: t('collateralRequired'),
  path: ["parentPropertyValue"],
}).refine((data) => {
  if (data.additionalResourceMethod === 'consumerLoan') {
    return data.consumerLoanInterestRate !== undefined && data.consumerLoanInterestRate > 0;
  }
  return true;
}, {
  message: t('consumerLoanRateRequired'),
  path: ["consumerLoanInterestRate"],
}).refine((data) => {
  if (data.downPayment > data.homePrice) {
    return false;
  }
  return true;
}, {
  message: t('maxDownPayment'),
  path: ["downPayment"],
}).refine((data) => {
  if (data.rateType === 'fixed') {
    return data.interestRate !== undefined && data.interestRate > 0;
  }
  return true;
}, {
  message: t('required'),
  path: ["interestRate"],
}).refine((data) => {
  if (data.rateType === 'variable') {
    return data.euribor !== undefined && data.bankMargin !== undefined;
  }
  return true;
}, {
  message: t('required'),
  path: ["bankMargin"],
});

export type MortgageFormData = z.infer<ReturnType<typeof getMortgageSchema>>;
