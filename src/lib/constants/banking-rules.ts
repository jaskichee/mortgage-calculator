export const BANKING_RULES = {
  MAX_DTI_PERCENT: 40, // Maximum Debt-to-Income ratio
  MAX_LTV_PERCENT: 80, // Maximum Loan-to-Value ratio
  COLLATERAL_LTV_PERCENT: 80, // LTV for collateral property
  MIN_DOWN_PAYMENT_PERCENT: 20, // Minimum down payment required (if no collateral)
} as const;
