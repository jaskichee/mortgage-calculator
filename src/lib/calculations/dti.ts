import Decimal from 'decimal.js';
import { BANKING_RULES } from '@/lib/constants/banking-rules';

export interface DTIResult {
  housingDTI: number;
  totalDTI: number;
  isHousingDTIValid: boolean;
  isTotalDTIValid: boolean;
  maxAllowedMonthlyPayment: number;
}

/**
 * Calculates Debt-to-Income ratios.
 * 
 * @param grossMonthlyIncome Total household gross monthly income
 * @param monthlyMortgagePayment Estimated monthly mortgage payment
 * @param otherMonthlyDebts Total of other monthly debt payments (loans, credit cards, etc.)
 * @returns DTIResult
 */
export function calculateDTI(
  grossMonthlyIncome: number,
  monthlyMortgagePayment: number,
  otherMonthlyDebts: number
): DTIResult {
  if (grossMonthlyIncome <= 0) {
    return {
      housingDTI: 0,
      totalDTI: 0,
      isHousingDTIValid: false,
      isTotalDTIValid: false,
      maxAllowedMonthlyPayment: 0,
    };
  }

  const income = new Decimal(grossMonthlyIncome);
  const mortgage = new Decimal(monthlyMortgagePayment);
  const debts = new Decimal(otherMonthlyDebts);

  const housingDTI = mortgage.dividedBy(income).times(100);
  const totalDTI = mortgage.plus(debts).dividedBy(income).times(100);

  // Max allowed payment for total debts to be under 40%
  // Max Total Debts = Income * 0.40
  // Max Mortgage = Max Total Debts - Other Debts
  const maxTotalDebts = income.times(BANKING_RULES.MAX_DTI_PERCENT).dividedBy(100);
  const maxAllowedMonthlyPayment = maxTotalDebts.minus(debts);

  return {
    housingDTI: housingDTI.toNumber(),
    totalDTI: totalDTI.toNumber(),
    isHousingDTIValid: housingDTI.lessThan(BANKING_RULES.MAX_DTI_PERCENT),
    isTotalDTIValid: totalDTI.lessThan(BANKING_RULES.MAX_DTI_PERCENT),
    maxAllowedMonthlyPayment: maxAllowedMonthlyPayment.greaterThan(0) ? maxAllowedMonthlyPayment.toNumber() : 0,
  };
}
