import Decimal from 'decimal.js';

export interface InvestmentAllocationResult {
  monthlyToEmergencyFund: number;
  monthlyToETF: number;
  monthlyToSavings: number;
  monthsToEmergencyFundTarget: number;
  isEmergencyFundFunded: boolean;
}

export interface IInvestmentStrategy {
  allocate(
    leftoverIncome: number,
    currentSavings: number,
    emergencyFundTarget: number,
    etfAllocationPercent: number
  ): InvestmentAllocationResult;
}

export class EmergencyFundFirstStrategy implements IInvestmentStrategy {
  allocate(
    leftoverIncome: number,
    currentSavings: number,
    emergencyFundTarget: number,
    etfAllocationPercent: number
  ): InvestmentAllocationResult {
    if (leftoverIncome <= 0) {
      return {
        monthlyToEmergencyFund: 0,
        monthlyToETF: 0,
        monthlyToSavings: 0,
        monthsToEmergencyFundTarget: Infinity,
        isEmergencyFundFunded: currentSavings >= emergencyFundTarget,
      };
    }

    const income = new Decimal(leftoverIncome);
    const savings = new Decimal(currentSavings);
    const target = new Decimal(emergencyFundTarget);
    
    const shortfall = target.minus(savings);
    
    if (shortfall.greaterThan(0)) {
      // Prioritize emergency fund - allocate all available income
      const toEmergency = income;
      const monthsToTarget = shortfall.dividedBy(income).ceil().toNumber();

      return {
        monthlyToEmergencyFund: toEmergency.toNumber(),
        monthlyToETF: 0,
        monthlyToSavings: 0, // All goes to emergency fund until full
        monthsToEmergencyFundTarget: monthsToTarget,
        isEmergencyFundFunded: false,
      };
    } else {
      // Emergency fund is full, split between ETF and Savings
      const etfPercent = new Decimal(etfAllocationPercent).dividedBy(100);
      const savingsPercent = new Decimal(1).minus(etfPercent);

      const toETF = income.times(etfPercent);
      const toSavings = income.times(savingsPercent);

      return {
        monthlyToEmergencyFund: 0,
        monthlyToETF: toETF.toNumber(),
        monthlyToSavings: toSavings.toNumber(),
        monthsToEmergencyFundTarget: 0,
        isEmergencyFundFunded: true,
      };
    }
  }
}

const defaultStrategy = new EmergencyFundFirstStrategy();

/**
 * Calculates how leftover income is allocated between Emergency Fund, ETFs, and Savings.
 * 
 * @param leftoverIncome Monthly income remaining after all expenses and debts
 * @param currentSavings Amount currently in savings
 * @param emergencyFundTarget Target amount for emergency fund
 * @param etfAllocationPercent Percentage of surplus to go to ETFs (0-100)
 * @returns InvestmentAllocationResult
 */
export function calculateInvestmentAllocation(
  leftoverIncome: number,
  currentSavings: number,
  emergencyFundTarget: number,
  etfAllocationPercent: number
): InvestmentAllocationResult {
  return defaultStrategy.allocate(leftoverIncome, currentSavings, emergencyFundTarget, etfAllocationPercent);
}
