'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalculatorData } from '@/lib/types';
import { calculateMortgagePayment, generateAmortizationSchedule } from '@/lib/calculations/mortgage';
import { calculateDTI } from '@/lib/calculations/dti';
import { validateCollateral } from '@/lib/calculations/collateral';
import { calculateEmergencyFund } from '@/lib/calculations/emergency-fund';
import { calculateInvestmentAllocation } from '@/lib/calculations/investment';
import { runStressTest } from '@/lib/calculations/stress-test';
import { calculateTotalChildCosts } from '@/lib/calculations/age-calculator';
import { DTIGauge } from '@/components/charts/DTIGauge';
import { CashFlowChart } from '@/components/charts/CashFlowChart';
import { AmortizationChart } from '@/components/charts/AmortizationChart';
import { StressTestChart } from '@/components/charts/StressTestChart';
import { EmergencyFundTracker } from '@/components/charts/EmergencyFundTracker';
import { SummaryCard } from '@/components/results/SummaryCard';
import { MortgageComparison } from '@/components/results/MortgageComparison';
import { StressTestTable } from '@/components/results/StressTestTable';
import { InvestmentAllocation } from '@/components/results/InvestmentAllocation';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

import { differenceInMonths, isAfter, addMonths, differenceInYears } from 'date-fns';
import { getChildCost } from '@/lib/calculations/age-calculator';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<CalculatorData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedData = localStorage.getItem('mortgage_calculator_data');
      if (storedData) {
        // Need to parse dates back to Date objects
        const parsed = JSON.parse(storedData, (key, value) => {
          if (key === 'birthDate' || key === 'carLoanEndDate') return new Date(value);
          return value;
        });
        setData(parsed);
      } else {
        router.push('/calculator');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  if (!data) return <div className="p-10 text-center">Loading results...</div>;

  // --- Calculations ---

  // 1. Income
  // Include 1/12th of annual bonuses
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
  // Determine effective interest rate
  const effectiveRate = data.mortgage.rateType === 'variable' 
    ? (data.mortgage.euribor || 0) + (data.mortgage.bankMargin || 0)
    : (data.mortgage.interestRate || 0);

  // Standard Option (20% Down)
  const standardLoanAmount = data.mortgage.homePrice * 0.80;
  const standardMortgage = calculateMortgagePayment(
    standardLoanAmount,
    effectiveRate,
    data.mortgage.loanTerm
  );

  // Collateral Option (0% Down)
  // User request: "When choosing payment with collateral, Down payment is not deducted from Home Price. It takes full House Price as Loan, instead of deducting down payment"
  // Correction: Deduct down payment if it exists.
  const collateralLoanAmount = data.mortgage.homePrice - (data.mortgage.downPayment || 0);
  const collateralMortgage = calculateMortgagePayment(
    collateralLoanAmount,
    effectiveRate,
    data.mortgage.loanTerm
  );

  // Consumer Loan Option (Third Option)
  // Assumption: Borrowing the gap to reach 20% down payment
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
  
  // Only show consumer loan option if it's relevant (LTV > 80) and user didn't pick collateral
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

  // Selected Mortgage for Main Dashboard
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
  } else if (data.mortgage.useCollateral || data.mortgage.additionalResourceMethod === 'collateral') {
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

  // User Selection Option (for comparison)
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
    data.mortgage.parentPropertyValue || 0
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
  // If consumer loan is selected, we need to pass the consumer loan payment as an additional fixed payment
  // The stress test logic will calculate the main mortgage payment based on principal/rate/years,
  // and add this additional payment to it.
  // Note: For stress test, we use the MAIN mortgage principal, not the total loan amount, 
  // because the consumer loan part is fixed and doesn't change with mortgage rate increases (usually).
  
  const stressTestPrincipal = isConsumerLoanSelected ? standardLoanAmount : selectedLoanAmount;
  
  let stressTestResults = runStressTest({
    principal: stressTestPrincipal,
    annualRate: effectiveRate,
    years: Number(data.mortgage.loanTerm),
    primaryIncome: data.income.primaryIncome,
    otherIncome: data.income.otherIncome + monthlyBonuses, // Include bonuses in stress test income
    monthlyDebts: monthlyDebts,
    monthlyExpenses: totalExpenses + childCosts,
    additionalMonthlyPayment: selectedConsumerLoanPayment,
  });

  // If Fixed Rate, the Rate Increase scenario is not applicable (or same as baseline)
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

  // 12. Stress Test Chart Data (Projected over 5 years with debt drop-off)
  const stressChartData = Array.from({ length: 6 }, (_, i) => {
    const year = i;
    const months = year * 12;
    
    let cumulativeBaseline = 0;
    let cumulativeRateIncrease = 0;
    let cumulativeJobLoss = 0;

    // Calculate cumulative surplus month by month
    for (let m = 1; m <= months; m++) {
        // Check if car loan is active
        let isCarLoanActive = false;
        if (data.debts.carLoanEndDate) {
          const remainingMonths = differenceInMonths(new Date(data.debts.carLoanEndDate), new Date());
          isCarLoanActive = m <= remainingMonths;
        }
        
        // Check if life insurance is active (assuming 'insurance' is the life insurance amount)
        const lifeInsuranceDurationMonths = (data.expenses.lifeInsuranceDuration || 0) * 12;
        const isLifeInsuranceActive = (data.expenses.lifeInsuranceDuration || 0) === 0 || m <= lifeInsuranceDurationMonths;

        // Adjustments: Add back the payment if the obligation is finished
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
      rateIncrease: cumulativeRateIncrease,
      jobLoss: cumulativeJobLoss,
    };
  });

  // Cash Flow Projection (Every year of the loan)
  const projectionYears = Array.from({ length: Number(data.mortgage.loanTerm) }, (_, i) => i + 1);
  const cashFlowData = projectionYears.map(year => {
    const monthsPassed = year * 12;
    const currentDate = addMonths(new Date(), monthsPassed);
    
    // Check if car loan is active
    const isCarLoanActive = data.debts.carLoanEndDate ? isAfter(data.debts.carLoanEndDate, currentDate) : true;
    
    // Check if life insurance is active
    const isLifeInsuranceActive = data.expenses.lifeInsuranceDuration ? year <= data.expenses.lifeInsuranceDuration : true;
    
    let projectedExpenses = totalExpenses;
    if (!isLifeInsuranceActive) {
        projectedExpenses -= (data.expenses.insurance || 0);
    }
    
    let projectedDebts = monthlyDebts;
    if (!isCarLoanActive) {
        projectedDebts -= (data.debts.carLoans || 0);
    }

    // Handle Consumer Loan drop-off
    // If consumer loan is selected, the 'Mortgage' bar currently includes it.
    // We need to separate it or adjust it.
    // Strategy: Calculate the main mortgage payment separately.
    // If year <= consumerLoanTerm, add consumer loan payment to 'Debts' or keep in 'Mortgage'.
    // Let's keep it in 'Mortgage' but reduce it if term is over.
    
    let projectedMortgagePayment = selectedMortgage.monthlyPayment;
    if (isConsumerLoanSelected && year > consumerLoanTerm) {
        projectedMortgagePayment -= selectedConsumerLoanPayment;
    }
    
    // Calculate child costs for this future year
    const projectedChildCosts = data.children.children.reduce((total, child) => {
        const futureAge = differenceInYears(currentDate, child.birthDate);
        return total + getChildCost(futureAge);
    }, 0);
    
    return {
        name: `Year ${year}`,
        Income: totalIncome,
        Expenses: projectedExpenses + projectedChildCosts,
        Debts: projectedDebts,
        Mortgage: projectedMortgagePayment,
        Leftover: totalIncome - (projectedExpenses + projectedChildCosts) - projectedDebts - projectedMortgagePayment
    };
  });

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data and start over?')) {
      localStorage.removeItem('mortgage_calculator_data');
      router.push('/calculator');
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-10 px-4 max-w-6xl space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
        <div className="space-x-4 no-print">
          <Button variant="outline" onClick={handleReset} className="text-red-600 border-red-200 hover:bg-red-50">Reset Data</Button>
          <Button variant="outline" onClick={() => router.push('/calculator')}>Edit Inputs</Button>
          <Button onClick={() => window.print()}>Export PDF</Button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard 
          title="Monthly Payment" 
          value={`€${selectedMortgage.monthlyPayment.toFixed(2)}`} 
          description={`${data.mortgage.loanTerm} years @ ${effectiveRate.toFixed(2)}%`}
        />
        <SummaryCard 
          title="Net Monthly Income" 
          value={`€${totalIncome.toFixed(2)}`} 
          status="success"
        />
        <SummaryCard 
          title="Monthly Surplus" 
          value={`€${(leftoverIncome || 0).toFixed(2)}`} 
          status={(leftoverIncome || 0) > 0 ? 'success' : 'danger'}
          description={(leftoverIncome || 0) > 0 ? 'Available for savings/investing' : 'Deficit!'}
        />
        <SummaryCard 
          title="DTI Ratio" 
          value={`${dtiResult.totalDTI.toFixed(1)}%`} 
          status={dtiResult.isTotalDTIValid ? 'success' : 'danger'}
          description={`Limit: 40% (${dtiResult.isTotalDTIValid ? 'Pass' : 'Fail'})`}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Affordability & Cash Flow */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Debt-to-Income Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <DTIGauge value={dtiResult.totalDTI} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Cash Flow Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <CashFlowChart data={cashFlowData} />
            </CardContent>
          </Card>

          <MortgageComparison 
            standard={{
              type: 'Standard (20% Down)',
              downPayment: data.mortgage.homePrice * 0.20,
              loanAmount: standardLoanAmount,
              loanTerm: Number(data.mortgage.loanTerm),
              monthlyPayment: standardMortgage.monthlyPayment,
              totalInterest: standardMortgage.totalInterest,
              totalCost: standardMortgage.totalPayment + (data.mortgage.homePrice * 0.20),
            }}
            collateral={{
              type: 'With Collateral',
              downPayment: data.mortgage.downPayment || 0,
              loanAmount: collateralLoanAmount,
              loanTerm: Number(data.mortgage.loanTerm),
              monthlyPayment: collateralMortgage.monthlyPayment,
              totalInterest: collateralMortgage.totalInterest,
              totalCost: collateralMortgage.totalPayment + (data.mortgage.downPayment || 0),
            }}
            userSelection={userSelectionOption}
            consumerLoanOption={consumerLoanOption}
          />

          <StressTestTable 
            results={stressTestResults} 
            isFixedRate={data.mortgage.rateType === 'fixed'}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Stress Test: 5-Year Savings Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <StressTestChart data={stressChartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amortization Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <AmortizationChart data={amortizationSchedule} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Planning & Status */}
        <div className="space-y-8">
          {data.mortgage.useCollateral && (
            <div className={`p-6 rounded-xl border backdrop-blur-sm shadow-sm ${collateralValidation.isValid ? 'bg-secondary/10 border-secondary/20' : 'bg-destructive/10 border-destructive/20'}`}>
              <h3 className={`font-semibold ${collateralValidation.isValid ? 'text-secondary' : 'text-destructive'}`}>
                Collateral Status: {collateralValidation.isValid ? 'Approved' : 'Insufficient'}
              </h3>
              <p className="text-sm mt-2 text-foreground">
                Required Equity (20% of Home): €{collateralValidation.requiredCollateralValue.toLocaleString()}
              </p>
              <p className="text-sm text-foreground">
                Available Equity (80% of Parent&apos;s): €{collateralValidation.availableCollateralValue.toLocaleString()}
              </p>
              {!collateralValidation.isValid && (
                <p className="text-sm font-bold mt-2 text-destructive">
                  Shortfall: €{collateralValidation.shortfall.toLocaleString()}
                </p>
              )}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Emergency Fund Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <EmergencyFundTracker 
                currentSavings={data.debts.existingSavings} 
                targetAmount={emergencyFund.targetAmount} 
                monthlyContribution={investmentAllocation.monthlyToEmergencyFund}
              />
            </CardContent>
          </Card>

          <InvestmentAllocation allocation={investmentAllocation} />
        </div>
      </div>
    </motion.div>
  );
}
