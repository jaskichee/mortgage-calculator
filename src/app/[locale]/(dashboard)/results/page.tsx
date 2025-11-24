'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCalculatorData } from '@/hooks/useCalculatorData';
import { useCalculatorResults } from '@/hooks/useCalculatorResults';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from '@/navigation';

export default function ResultsPage() {
  const t = useTranslations('Results');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  
  const data = useCalculatorData();
  const results = useCalculatorResults(data);

  if (!data || !results) return <div className="p-10 text-center">{tCommon('loading')}</div>;

  const {
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
  } = results;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20 max-w-7xl pt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            {t('actions.export')}
          </Button>
          <Button variant="outline" onClick={() => router.push('/calculator?reset=true')}>
            {tCommon('reset')}
          </Button>
          <Button variant="outline" onClick={() => router.push('/calculator?edit=true')}>
            {t('editInputs')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title={t('summary.monthlyPayment')}
          value={`€${selectedMortgage.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          description={`${t('summary.rate')}: ${effectiveRate.toFixed(2)}%`}
          status={dtiResult.isTotalDTIValid ? 'success' : 'danger'}
        />
        <SummaryCard 
          title={t('summary.surplus')}
          value={`€${stressTestResults.baseline.monthlySurplus.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          description={t('summary.afterAllExpenses')}
          status={stressTestResults.baseline.monthlySurplus > 0 ? 'success' : 'danger'}
        />
        <SummaryCard 
          title={t('summary.dti')}
          value={`${dtiResult.totalDTI.toFixed(2)}%`}
          description={`Max: 50%`}
          status={dtiResult.isTotalDTIValid ? 'success' : 'warning'}
        />
        <SummaryCard 
          title={t('summary.emergencyFund')}
          value={`€${emergencyFund.targetAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          description={`${emergencyFund.monthsOfExpenses} ${tCommon('months')}`}
          status={investmentAllocation.isEmergencyFundFunded ? 'success' : 'warning'}
        />
      </div>

      {/* Mortgage Comparison */}
      <MortgageComparison 
        standard={{
          type: 'Standard (20% Down)',
          downPayment: data.mortgage.homePrice * 0.20,
          loanAmount: data.mortgage.homePrice * 0.80,
          loanTerm: Number(data.mortgage.loanTerm),
          monthlyPayment: standardMortgage.monthlyPayment,
          totalInterest: standardMortgage.totalInterest,
          totalCost: standardMortgage.totalPayment
        }}
        collateral={data.mortgage.parentPropertyValue ? {
          type: 'With Collateral (0% Down)',
          downPayment: 0,
          loanAmount: data.mortgage.homePrice,
          loanTerm: Number(data.mortgage.loanTerm),
          monthlyPayment: collateralMortgage.monthlyPayment,
          totalInterest: collateralMortgage.totalInterest,
          totalCost: collateralMortgage.totalPayment
        } : undefined}
        consumerLoanOption={consumerLoanOption}
        userSelection={userSelectionOption}
      />

      {/* DTI & Affordability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dtiAnalysis')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <DTIGauge value={dtiResult.totalDTI} max={100} />
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-gray-500">
                {t('housingDti')}: <span className="font-semibold">{dtiResult.housingDTI.toFixed(2)}%</span>
              </p>
              <p className="text-sm text-gray-500">
                {t('maxAllowedPayment')}: <span className="font-semibold">€{dtiResult.maxAllowedMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('collateralCheck')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span>{t('requiredCollateral')}</span>
                <span className="font-bold">€{collateralValidation.requiredCollateralValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span>{t('availableCollateral')} (80% LTV)</span>
                <span className="font-bold">€{collateralValidation.availableCollateralValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              
              {collateralValidation.isValid ? (
                <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
                  {t('collateralSufficient')}
                </div>
              ) : (
                <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center font-medium">
                  {t('collateralInsufficient')} (-€{collateralValidation.shortfall.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stress Test */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('stressTestProjection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <StressTestChart data={stressChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('stressTestScenarios')}</CardTitle>
          </CardHeader>
          <CardContent>
            <StressTestTable results={stressTestResults} />
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow & Amortization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('cashFlowProjection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart data={cashFlowData.map(d => ({
              name: `Year ${d.year}`,
              income: d.income,
              expenses: d.expenses,
              debts: d.debts,
              mortgage: d.mortgage,
              leftover: d.surplus
            }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('amortizationSchedule')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AmortizationChart data={amortizationSchedule} />
          </CardContent>
        </Card>
      </div>

      {/* Financial Health & Investment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('emergencyFundTracker')}</CardTitle>
          </CardHeader>
          <CardContent>
            <EmergencyFundTracker 
              currentSavings={data.debts.existingSavings} 
              targetAmount={emergencyFund.targetAmount} 
              monthlyContribution={investmentAllocation.monthlyToEmergencyFund}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('investmentAllocation.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <InvestmentAllocation 
              allocation={investmentAllocation} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
