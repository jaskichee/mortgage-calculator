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

export interface IStressTestScenario {
  name: string;
  calculate(input: StressTestInput): ScenarioResult;
}

abstract class BaseScenario implements IStressTestScenario {
  constructor(public name: string) {}

  calculate(input: StressTestInput): ScenarioResult {
    const rate = this.getRate(input);
    const pIncome = this.getPrimaryIncome(input);
    const oIncome = this.getOtherIncome(input);
    
    const mortgagePayment = calculateMortgagePayment(input.principal, rate, input.years).monthlyPayment;
    const totalMonthlyPayment = mortgagePayment + (input.additionalMonthlyPayment || 0);
    
    const totalIncome = new Decimal(pIncome).plus(oIncome).toNumber();
    
    const { totalDTI } = calculateDTI(totalIncome, totalMonthlyPayment, input.monthlyDebts);
    
    const totalOutflow = new Decimal(totalMonthlyPayment)
      .plus(input.monthlyDebts)
      .plus(input.monthlyExpenses)
      .toNumber();
      
    const monthlySurplus = new Decimal(totalIncome).minus(totalOutflow).toNumber();
    
    const isAffordable = monthlySurplus >= 0;

    return {
      name: this.name,
      monthlyPayment: totalMonthlyPayment,
      totalDTI,
      monthlySurplus,
      isAffordable,
    };
  }

  protected getRate(input: StressTestInput): number { return input.annualRate; }
  protected getPrimaryIncome(input: StressTestInput): number { return input.primaryIncome; }
  protected getOtherIncome(input: StressTestInput): number { return input.otherIncome; }
}

export class BaselineScenario extends BaseScenario {
  constructor() { super('Baseline'); }
}

export class RateIncreaseScenario extends BaseScenario {
  constructor(private increasePercent: number = 2) { super(`Interest Rate +${increasePercent}%`); }
  
  protected getRate(input: StressTestInput): number {
    return input.annualRate + this.increasePercent;
  }
}

export class JobLossScenario extends BaseScenario {
  constructor() { super('Job Loss (Primary)'); }
  
  protected getPrimaryIncome(input: StressTestInput): number {
    void input;
    return 0;
  }
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
  const baselineScenario = new BaselineScenario();
  const rateIncreaseScenario = new RateIncreaseScenario(2);
  const jobLossScenario = new JobLossScenario();

  return {
    baseline: baselineScenario.calculate(input),
    rateIncrease: rateIncreaseScenario.calculate(input),
    jobLoss: jobLossScenario.calculate(input),
  };
}
