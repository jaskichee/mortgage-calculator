import Decimal from 'decimal.js';

export interface MortgagePaymentResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  equity: number;
}

export interface IMortgageCalculator {
  calculatePayment(principal: number, annualRate: number, years: number): MortgagePaymentResult;
  generateSchedule(
    principal: number,
    annualRate: number,
    years: number,
    homeValue: number,
    knownMonthlyPayment?: number
  ): AmortizationEntry[];
}

export class AnnuityMortgageCalculator implements IMortgageCalculator {
  calculatePayment(principal: number, annualRate: number, years: number): MortgagePaymentResult {
    if (principal <= 0 || years <= 0 || isNaN(principal) || isNaN(years)) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
    }

    if (annualRate === 0 || isNaN(annualRate)) {
      const monthlyPayment = new Decimal(principal).dividedBy(years * 12);
      return {
        monthlyPayment: monthlyPayment.toNumber(),
        totalPayment: principal,
        totalInterest: 0,
      };
    }

    const P = new Decimal(principal);
    const r = new Decimal(annualRate).dividedBy(100).dividedBy(12);
    const n = years * 12;

    // (1 + r)^n
    const factor = r.plus(1).pow(n);

    // M = P * [r * factor] / [factor - 1]
    const numerator = r.times(factor);
    const denominator = factor.minus(1);
    
    const monthlyPayment = P.times(numerator).dividedBy(denominator);
    const totalPayment = monthlyPayment.times(n);
    const totalInterest = totalPayment.minus(P);

    return {
      monthlyPayment: monthlyPayment.toNumber(),
      totalPayment: totalPayment.toNumber(),
      totalInterest: totalInterest.toNumber(),
    };
  }

  generateSchedule(
    principal: number,
    annualRate: number,
    years: number,
    homeValue: number,
    knownMonthlyPayment?: number
  ): AmortizationEntry[] {
    if (principal <= 0 || years <= 0) return [];

    const schedule: AmortizationEntry[] = [];
    let balance = new Decimal(principal);
    const r = new Decimal(annualRate).dividedBy(100).dividedBy(12);
    const n = years * 12;
    
    const monthlyPayment = knownMonthlyPayment ?? this.calculatePayment(principal, annualRate, years).monthlyPayment;
    const monthlyPaymentDec = new Decimal(monthlyPayment);

    for (let month = 1; month <= n; month++) {
      // Interest for this month = Balance * r
      const interest = balance.times(r);
      
      // Principal for this month = Payment - Interest
      // If it's the last month or balance is low, adjust
      let principalPayment = monthlyPaymentDec.minus(interest);
      
      if (month === n || balance.minus(principalPayment).lessThan(0)) {
        principalPayment = balance;
      }

      balance = balance.minus(principalPayment);
      
      // Equity = Home Value - Remaining Balance
      // Assuming home value stays constant for simplicity, or we could add appreciation later
      const equity = new Decimal(homeValue).minus(balance);

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment.toNumber(),
        interest: interest.toNumber(),
        balance: balance.toNumber(),
        equity: equity.toNumber(),
      });

      if (balance.lessThanOrEqualTo(0)) break;
    }

    return schedule;
  }
}

const defaultCalculator = new AnnuityMortgageCalculator();

/**
 * Calculates the monthly mortgage payment using the annuity formula.
 * M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 * 
 * @param principal Loan amount (P)
 * @param annualRate Annual interest rate in percent (e.g., 3.5 for 3.5%)
 * @param years Loan term in years
 * @returns MortgagePaymentResult
 */
export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): MortgagePaymentResult {
  return defaultCalculator.calculatePayment(principal, annualRate, years);
}

/**
 * Generates the amortization schedule for the mortgage.
 * 
 * @param principal Loan amount
 * @param annualRate Annual interest rate in percent
 * @param years Loan term in years
 * @param homeValue Original home value (for equity calculation)
 * @returns Array of AmortizationEntry
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number,
  homeValue: number,
  knownMonthlyPayment?: number
): AmortizationEntry[] {
  return defaultCalculator.generateSchedule(principal, annualRate, years, homeValue, knownMonthlyPayment);
}
