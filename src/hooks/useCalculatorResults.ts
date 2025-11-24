import { useMemo } from 'react';
import { CalculatorData } from '@/lib/types';
import { calculateMortgagePayment, generateAmortizationSchedule } from '@/lib/calculations/mortgage';
import { calculateDTI } from '@/lib/calculations/dti';
import { validateCollateral } from '@/lib/calculations/collateral';
import { calculateEmergencyFund } from '@/lib/calculations/emergency-fund';
import { calculateInvestmentAllocation } from '@/lib/calculations/investment';
import { runStressTest } from '@/lib/calculations/stress-test';
import { calculateTotalChildCosts } from '@/lib/calculations/age-calculator';
import { differenceInMonths, isAfter, addMonths } from 'date-fns';

export function useCalculatorResults(data: CalculatorData | null) {
  return useMemo(() => {
    if (!data) return null;

    // 1. Income
    const monthlyBonuses = ((data.income.primaryBonuses || 0) + (data.income.otherBonuses || 0)) / 12;
    const totalIncome = (data.income.primaryIncome || 0) + (data.income.otherIncome || 0) + monthlyBonuses;

    // 2. Expenses
    const totalExpenses = 
      (data.expenses.utilities || 0) + 
      (data.expenses.insurance || 0) + 
      (data.expenses.subscriptions || 0) + 
      (data.expenses.groceries || 0) + 
      (data.expenses.transportation || 0) + 
      (data.expenses.entertainment || 0) + 
      (data.expenses.other || 0);

    // 3. Children Costs
    const childCosts = calculateTotalChildCosts(data.children.children.map(c => c.birthDate));

    // 4. Debts
    const monthlyDebts = 
      (data.debts.studentLoans || 0) + 
      (data.debts.creditCards || 0) + 
      (data.debts.carLoans || 0) + 
      (data.debts.otherLoans || 0);

    // 5. Mortgage
    const effectiveRate = data.mortgage.rateType === 'variable' 
      ? (data.mortgage.euribor || 0) + (data.mortgage.bankMargin || 0)
      : (data.mortgage.interestRate || 0);

    const standardLoanAmount = data.mortgage.homePrice * 0.80;
    const standardMortgage = calculateMortgagePayment(
      standardLoanAmount,
      effectiveRate,
      data.mortgage.loanTerm
    );

    const collateralLoanAmount = data.mortgage.homePrice - (data.mortgage.downPayment || 0);
    const collateralMortgage = calculateMortgagePayment(
      collateralLoanAmount,
      effectiveRate,
      data.mortgage.loanTerm
    );

    // Consumer Loan Option
    const requiredDownPayment = data.mortgage.homePrice * 0.20;
    const userDownPayment = data.mortgage.downPayment || 0;
    const consumerLoanPrincipal = Math.max(0, requiredDownPayment - userDownPayment);
    const consumerLoanRate = data.mortgage.consumerLoanInterestRate || 6.5;
    const consumerLoanTerm = data.mortgage.consumerLoanTerm || 10;
    
    const consumerLoanPayment = calculateMortgagePayment(
      consumerLoanPrincipal,
      consumerLoanRate,
      consumerLoanTerm
    );
    
    const showConsumerLoanOption = (data.mortgage.homePrice * 0.8) < (data.mortgage.homePrice - userDownPayment);
    
    const consumerLoanOption = showConsumerLoanOption ? {
      type: 'With Consumer Loan',
      downPayment: userDownPayment, 
      loanAmount: standardLoanAmount + consumerLoanPrincipal,
      loanTerm: Number(data.mortgage.loanTerm),
      monthlyPayment: standardMortgage.monthlyPayment + consumerLoanPayment.monthlyPayment,
      consumerLoanMonthlyPayment: consumerLoanPayment.monthlyPayment,
      consumerLoanRate: consumerLoanRate,
      consumerLoanTerm: consumerLoanTerm,
      totalInterest: standardMortgage.totalInterest + consumerLoanPayment.totalInterest,
      totalCost: standardMortgage.totalPayment + consumerLoanPayment.totalPayment
    } : undefined;

    // Selected Mortgage
    let selectedMortgage;
    let selectedLoanAmount;
    let selectedConsumerLoanPayment = 0;
    const isConsumerLoanSelected = data.mortgage.additionalResourceMethod === 'consumerLoan';

    if (isConsumerLoanSelected) {
        selectedMortgage = {
            monthlyPayment: standardMortgage.monthlyPayment + consumerLoanPayment.monthlyPayment,
            totalPayment: standardMortgage.totalPayment + consumerLoanPayment.totalPayment,
            totalInterest: standardMortgage.totalInterest + consumerLoanPayment.totalInterest,
        };
        selectedLoanAmount = standardLoanAmount + consumerLoanPrincipal;
        selectedConsumerLoanPayment = consumerLoanPayment.monthlyPayment;
    } else if (data.mortgage.useCollateral || data.mortgage.additionalResourceMethod === 'collateral' || data.mortgage.additionalResourceMethod === 'guarantor') {
        selectedMortgage = collateralMortgage;
        selectedLoanAmount = collateralLoanAmount;
    } else {
        selectedMortgage = calculateMortgagePayment(
          data.mortgage.homePrice - userDownPayment,
          effectiveRate,
          data.mortgage.loanTerm
        );
        selectedLoanAmount = data.mortgage.homePrice - userDownPayment;
    }

    const userSelectionOption = {
      type: 'Your Selection',
      downPayment: data.mortgage.downPayment,
      loanAmount: selectedLoanAmount,
      loanTerm: Number(data.mortgage.loanTerm),
      monthlyPayment: selectedMortgage.monthlyPayment,
      consumerLoanMonthlyPayment: selectedConsumerLoanPayment > 0 ? selectedConsumerLoanPayment : undefined,
      consumerLoanRate: selectedConsumerLoanPayment > 0 ? consumerLoanRate : undefined,
      consumerLoanTerm: selectedConsumerLoanPayment > 0 ? consumerLoanTerm : undefined,
      totalInterest: selectedMortgage.totalInterest,
      totalCost: selectedMortgage.totalPayment
    };

    // 6. DTI
    const dtiResult = calculateDTI(totalIncome, selectedMortgage.monthlyPayment, monthlyDebts);

    // 7. Collateral Validation
    const collateralValidation = validateCollateral(
      data.mortgage.homePrice,
      data.mortgage.parentPropertyValue || 0,
      data.mortgage.downPayment || 0,
      isConsumerLoanSelected
    );

    // 8. Emergency Fund
    const fixedExpenses = data.expenses.utilities + data.expenses.insurance + data.expenses.subscriptions;
    const variableExpenses = data.expenses.groceries + data.expenses.transportation + data.expenses.entertainment + data.expenses.other;

    const emergencyFund = calculateEmergencyFund(
      fixedExpenses,
      variableExpenses,
      childCosts,
      (monthlyDebts || 0) + (selectedMortgage.monthlyPayment || 0),
      data.investment.emergencyFundMonths
    );

    // 9. Investment Allocation
    const leftoverIncome = totalIncome - totalExpenses - childCosts - monthlyDebts - selectedMortgage.monthlyPayment;
    
    const investmentAllocation = calculateInvestmentAllocation(
      leftoverIncome || 0,
      data.debts.existingSavings || 0,
      emergencyFund.targetAmount || 0,
      data.investment.etfAllocation
    );

    // 10. Stress Test
    const stressTestPrincipal = isConsumerLoanSelected ? standardLoanAmount : selectedLoanAmount;
    
    let stressTestResults = runStressTest({
      principal: stressTestPrincipal,
      annualRate: effectiveRate,
      years: Number(data.mortgage.loanTerm),
      primaryIncome: data.income.primaryIncome,
      otherIncome: data.income.otherIncome + monthlyBonuses,
      monthlyDebts: monthlyDebts,
      monthlyExpenses: totalExpenses + childCosts,
      additionalMonthlyPayment: selectedConsumerLoanPayment,
    });

    if (data.mortgage.rateType === 'fixed') {
      stressTestResults = {
        ...stressTestResults,
        rateIncrease: {
          ...stressTestResults.baseline,
          name: 'Rate Increase (Fixed)',
        }
      };
    }

    // 11. Amortization Schedule
    const amortizationSchedule = generateAmortizationSchedule(
      selectedLoanAmount,
      effectiveRate,
      data.mortgage.loanTerm,
      data.mortgage.homePrice
    );

    // 12. Stress Test Chart Data
    const stressChartData = Array.from({ length: 6 }, (_, i) => {
      const year = i;
      const months = year * 12;
      
      let cumulativeBaseline = 0;
      let cumulativeRateIncrease = 0;
      let cumulativeJobLoss = 0;

      for (let m = 1; m <= months; m++) {
          let isCarLoanActive = false;
          if (data.debts.carLoanEndDate) {
            const remainingMonths = differenceInMonths(new Date(data.debts.carLoanEndDate), new Date());
            isCarLoanActive = m <= remainingMonths;
          }
          
          const lifeInsuranceDurationMonths = (data.expenses.lifeInsuranceDuration || 0) * 12;
          const isLifeInsuranceActive = (data.expenses.lifeInsuranceDuration || 0) === 0 || m <= lifeInsuranceDurationMonths;

          let adjustment = 0;
          if (!isCarLoanActive) adjustment += data.debts.carLoans;
          if (!isLifeInsuranceActive) adjustment += data.expenses.insurance;

          cumulativeBaseline += (stressTestResults.baseline.monthlySurplus + adjustment);
          cumulativeRateIncrease += (stressTestResults.rateIncrease.monthlySurplus + adjustment);
          cumulativeJobLoss += (stressTestResults.jobLoss.monthlySurplus + adjustment);
      }

      return {
        year,
        baseline: cumulativeBaseline,
        rateIncrease: data.mortgage.rateType === 'fixed' ? null : cumulativeRateIncrease,
        jobLoss: cumulativeJobLoss,
      };
    });

    // Cash Flow Projection
    const projectionYears = Array.from({ length: Number(data.mortgage.loanTerm) }, (_, i) => i + 1);
    const cashFlowData = projectionYears.map(year => {
      const monthsPassed = year * 12;
      const currentDate = addMonths(new Date(), monthsPassed);
      
      const isCarLoanActive = data.debts.carLoanEndDate ? isAfter(data.debts.carLoanEndDate, currentDate) : true;
      const isLifeInsuranceActive = data.expenses.lifeInsuranceDuration ? year <= data.expenses.lifeInsuranceDuration : true;
      
      let projectedExpenses = totalExpenses;
      if (!isLifeInsuranceActive) {
        projectedExpenses -= data.expenses.insurance;
      }

      let projectedDebts = monthlyDebts;
      if (!isCarLoanActive) {
        projectedDebts -= data.debts.carLoans;
      }

      const projectedOutflow = projectedExpenses + childCosts + projectedDebts + selectedMortgage.monthlyPayment;
      const projectedSurplus = totalIncome - projectedOutflow;

      return {
        year,
        income: totalIncome,
        expenses: projectedExpenses + childCosts,
        debts: projectedDebts,
        mortgage: selectedMortgage.monthlyPayment,
        surplus: projectedSurplus
      };
    });

    return {
      totalIncome,
      totalExpenses,
      childCosts,
      monthlyDebts,
      effectiveRate,
      standardMortgage,
      collateralMortgage,
      consumerLoanOption,
      userSelectionOption,
      dtiResult,
      collateralValidation,
      emergencyFund,
      investmentAllocation,
      stressTestResults,
      amortizationSchedule,
      stressChartData,
      cashFlowData,
      selectedMortgage,
      selectedLoanAmount
    };
  }, [data]);
}
