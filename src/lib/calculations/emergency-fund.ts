import Decimal from 'decimal.js';

export interface EmergencyFundResult {
  targetAmount: number;
  monthsOfExpenses: number;
  monthlyEssentialExpenses: number;
}

/**
 * Calculates the target emergency fund amount.
 * 
 * @param monthlyFixedExpenses Fixed monthly expenses (utilities, etc.)
 * @param monthlyVariableExpenses Variable monthly expenses (food, etc.)
 * @param monthlyChildCosts Total monthly costs for children
 * @param monthlyDebtPayments Total monthly debt payments (including new mortgage)
 * @param monthsToCover Number of months to cover (user selected, e.g., 3-6)
 * @returns EmergencyFundResult
 */
export function calculateEmergencyFund(
  monthlyFixedExpenses: number,
  monthlyVariableExpenses: number,
  monthlyChildCosts: number,
  monthlyDebtPayments: number,
  monthsToCover: number
): EmergencyFundResult {
  const fixed = new Decimal(monthlyFixedExpenses);
  const variable = new Decimal(monthlyVariableExpenses);
  const children = new Decimal(monthlyChildCosts);
  const debt = new Decimal(monthlyDebtPayments);

  const monthlyEssentialExpenses = fixed.plus(variable).plus(children).plus(debt);
  const targetAmount = monthlyEssentialExpenses.times(monthsToCover);

  return {
    targetAmount: targetAmount.toNumber(),
    monthsOfExpenses: monthsToCover,
    monthlyEssentialExpenses: monthlyEssentialExpenses.toNumber(),
  };
}
