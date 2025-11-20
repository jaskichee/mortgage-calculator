import { calculateMortgagePayment } from './mortgage';
import { calculateDTI } from './dti';
import Decimal from 'decimal.js';

export interface StressTestInput {
  principal: number;
  annualRate: number;
  years: number;
  primaryIncome: number;
  otherIncome: number;
  monthlyDebts: number; // Excluding mortgage
  monthlyExpenses: number; // Excluding debts and mortgage
  additionalMonthlyPayment?: number; // e.g. Consumer Loan payment
}

export interface ScenarioResult {
  name: string;
  monthlyPayment: number;
  totalDTI: number;
  monthlySurplus: number;
  isAffordable: boolean;
}

export interface StressTestResult {
  baseline: ScenarioResult;
  rateIncrease: ScenarioResult;
  jobLoss: ScenarioResult;
}

/**
 * Runs stress test scenarios.
 * 
 * Scenarios:
 * 1. Baseline: Current inputs
 * 2. Rate Increase: Interest rate + 2%
 * 3. Job Loss: Primary income removed
 * 
 * @param input StressTestInput
 * @returns StressTestResult
 */
export function runStressTest(input: StressTestInput): StressTestResult {
  const {
    principal,
    annualRate,
    years,
    primaryIncome,
    otherIncome,
    monthlyDebts,
    monthlyExpenses,
    additionalMonthlyPayment = 0,
  } = input;

  // Helper to calculate single scenario
  const calculateScenario = (
    name: string,
    rate: number,
    pIncome: number,
    oIncome: number
  ): ScenarioResult => {
    const mortgagePayment = calculateMortgagePayment(principal, rate, years).monthlyPayment;
    const totalMonthlyPayment = mortgagePayment + additionalMonthlyPayment;
    
    const totalIncome = new Decimal(pIncome).plus(oIncome).toNumber();
    
    const { totalDTI } = calculateDTI(totalIncome, totalMonthlyPayment, monthlyDebts);
    
    const totalOutflow = new Decimal(totalMonthlyPayment)
      .plus(monthlyDebts)
      .plus(monthlyExpenses)
      .toNumber();
      
    const monthlySurplus = new Decimal(totalIncome).minus(totalOutflow).toNumber();
    
    // Affordable if DTI < 40% AND Surplus > 0
    // Note: In job loss scenario, DTI might be high, but if surplus is positive, they survive.
    // But strictly speaking, bank rules apply to DTI.
    // For stress test "survival", surplus is key.
    // Let's mark affordable if surplus >= 0.
    const isAffordable = monthlySurplus >= 0;

    return {
      name,
      monthlyPayment: totalMonthlyPayment,
      totalDTI,
      monthlySurplus,
      isAffordable,
    };
  };

  // 1. Baseline
  const baseline = calculateScenario(
    'Baseline',
    annualRate,
    primaryIncome,
    otherIncome
  );

  // 2. Rate Increase (+2%)
  const rateIncrease = calculateScenario(
    'Interest Rate +2%',
    annualRate + 2,
    primaryIncome,
    otherIncome
  );

  // 3. Job Loss (Remove Primary Income)
  const jobLoss = calculateScenario(
    'Job Loss (Primary)',
    annualRate,
    0, // Primary income 0
    otherIncome
  );

  return {
    baseline,
    rateIncrease,
    jobLoss,
  };
}
