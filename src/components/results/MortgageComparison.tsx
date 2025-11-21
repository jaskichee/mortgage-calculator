'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface MortgageOption {
  type: string;
  downPayment: number;
  loanAmount: number;
  loanTerm: number;
  monthlyPayment: number;
  consumerLoanMonthlyPayment?: number;
  consumerLoanRate?: number;
  consumerLoanTerm?: number;
  totalInterest: number;
  totalCost: number;
}

interface MortgageComparisonProps {
  standard: MortgageOption;
  collateral: MortgageOption;
  userSelection?: MortgageOption;
  consumerLoanOption?: MortgageOption;
}

export function MortgageComparison({ standard, collateral, userSelection, consumerLoanOption }: MortgageComparisonProps) {
  const [showConsumerDetails, setShowConsumerDetails] = useState(false);

  const showUserSelection = userSelection && 
    userSelection.downPayment !== standard.downPayment && 
    userSelection.downPayment !== collateral.downPayment;

  // Determine which option is selected to ensure it's visible on mobile
  const isConsumerSelected = consumerLoanOption && userSelection && 
    Math.abs(userSelection.monthlyPayment - consumerLoanOption.monthlyPayment) < 0.01;

  const userHasConsumerLoan = !!userSelection?.consumerLoanMonthlyPayment;
  const hasConsumerData = !!consumerLoanOption || userHasConsumerLoan;
  
  // If consumer loan column is hidden (mobile & not selected) AND user selection has no consumer loan,
  // then the breakdown is useless on mobile.
  const toggleVisibilityClass = hasConsumerData 
    ? (isConsumerSelected || userHasConsumerLoan ? 'inline' : 'hidden sm:inline') 
    : 'hidden';

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Mortgage Options Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-white/10">
              <tr>
                <th className="px-6 py-3">Metric</th>
                <th className="px-6 py-3 text-center">Standard (20% Down)</th>
                <th className="px-6 py-3 text-center">With Collateral (0% Down)</th>
                {consumerLoanOption && <th className={`px-6 py-3 text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>With Consumer Loan</th>}
                {showUserSelection && <th className="px-6 py-3 text-center">Your Selection</th>}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-card border-b border-border">
                <td className="px-6 py-4 font-medium text-foreground">Down Payment</td>
                <td className="px-6 py-4 text-foreground text-center">€{standard.downPayment.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-center">€{collateral.downPayment.toLocaleString()}</td>
                {consumerLoanOption && <td className={`px-6 py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.downPayment.toLocaleString()}</td>}
                {showUserSelection && <td className="px-6 py-4 text-primary font-bold text-center">€{userSelection.downPayment.toLocaleString()}</td>}
              </tr>
              <tr className="bg-card border-b border-border">
                <td className="px-6 py-4 font-medium text-foreground">Loan Amount</td>
                <td className="px-6 py-4 text-foreground text-center">€{standard.loanAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-foreground text-center">€{collateral.loanAmount.toLocaleString()}</td>
                {consumerLoanOption && <td className={`px-6 py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.loanAmount.toLocaleString()}</td>}
                {showUserSelection && <td className="px-6 py-4 text-foreground text-center">€{userSelection.loanAmount.toLocaleString()}</td>}
              </tr>
              <tr className="bg-card border-b border-border">
                <td className="px-6 py-4 font-medium text-foreground">Loan Term</td>
                <td className="px-6 py-4 text-foreground text-center">{standard.loanTerm} years</td>
                <td className="px-6 py-4 text-foreground text-center">{collateral.loanTerm} years</td>
                {consumerLoanOption && <td className={`px-6 py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>{consumerLoanOption.loanTerm} years</td>}
                {showUserSelection && <td className="px-6 py-4 text-foreground text-center">{userSelection.loanTerm} years</td>}
              </tr>
              <tr 
                className="bg-card border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setShowConsumerDetails(!showConsumerDetails)}
                title="Click to toggle consumer loan details"
              >
                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                  Monthly Payment (Total)
                  <span className={`text-[10px] text-muted-foreground ${toggleVisibilityClass}`}>{showConsumerDetails ? '▲' : '▼'}</span>
                </td>
                <td className="px-6 py-4 text-foreground text-center">€{standard.monthlyPayment.toFixed(2)}</td>
                <td className="px-6 py-4 text-foreground text-center">€{collateral.monthlyPayment.toFixed(2)}</td>
                {consumerLoanOption && <td className={`px-6 py-4 text-foreground font-bold text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.monthlyPayment.toFixed(2)}</td>}
                {showUserSelection && <td className="px-6 py-4 text-foreground text-center">€{userSelection.monthlyPayment.toFixed(2)}</td>}
              </tr>
              
              {/* Consumer Loan Breakdown */}
              {showConsumerDetails && (consumerLoanOption?.consumerLoanMonthlyPayment || userSelection?.consumerLoanMonthlyPayment) && (
                <>
                  <tr className="bg-muted/20 border-b border-border">
                    <td className="px-6 py-1 font-medium text-muted-foreground pl-10 text-xs">↳ Consumer Loan Part</td>
                    <td className="px-6 py-1 text-muted-foreground text-xs text-center">-</td>
                    <td className="px-6 py-1 text-muted-foreground text-xs text-center">-</td>
                    {consumerLoanOption && <td className={`px-6 py-1 text-foreground text-xs text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.consumerLoanMonthlyPayment?.toFixed(2)}</td>}
                    {showUserSelection && <td className="px-6 py-1 text-foreground text-xs text-center">{userSelection?.consumerLoanMonthlyPayment ? `€${userSelection.consumerLoanMonthlyPayment.toFixed(2)}` : '-'}</td>}
                  </tr>
                  <tr className="bg-muted/20 border-b border-border">
                    <td className="px-6 py-1 font-medium text-muted-foreground pl-10 text-xs">↳ Consumer Loan Rate</td>
                    <td className="px-6 py-1 text-muted-foreground text-xs text-center">-</td>
                    <td className="px-6 py-1 text-muted-foreground text-xs text-center">-</td>
                    {consumerLoanOption && <td className={`px-6 py-1 text-foreground text-xs text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>{consumerLoanOption.consumerLoanRate}%</td>}
                    {showUserSelection && <td className="px-6 py-1 text-foreground text-xs text-center">{userSelection?.consumerLoanRate ? `${userSelection.consumerLoanRate}%` : '-'}</td>}
                  </tr>
                  <tr className="bg-muted/20 border-b border-border">
                    <td className="px-6 py-1 font-medium text-muted-foreground pl-10 text-xs">↳ Consumer Loan Length</td>
                    <td className="px-6 py-1 text-muted-foreground text-xs text-center">-</td>
                    <td className="px-6 py-1 text-muted-foreground text-xs text-center">-</td>
                    {consumerLoanOption && <td className={`px-6 py-1 text-foreground text-xs text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>{consumerLoanOption.consumerLoanTerm} years</td>}
                    {showUserSelection && <td className="px-6 py-1 text-foreground text-xs text-center">{userSelection?.consumerLoanTerm ? `${userSelection.consumerLoanTerm} years` : '-'}</td>}
                  </tr>
                </>
              )}

              <tr className="bg-card border-b border-border">
                <td className="px-6 py-4 font-medium text-foreground">Total Interest</td>
                <td className="px-6 py-4 text-foreground text-center">€{standard.totalInterest.toLocaleString()}</td>
                <td className="px-6 py-4 text-foreground text-center">€{collateral.totalInterest.toLocaleString()}</td>
                {consumerLoanOption && <td className={`px-6 py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.totalInterest.toLocaleString()}</td>}
                {showUserSelection && <td className="px-6 py-4 text-foreground text-center">€{userSelection.totalInterest.toLocaleString()}</td>}
              </tr>
              <tr className="bg-card">
                <td className="px-6 py-4 font-medium text-foreground">Total Cost</td>
                <td className="px-6 py-4 text-foreground text-center">€{standard.totalCost.toLocaleString()}</td>
                <td className="px-6 py-4 text-foreground text-center">€{collateral.totalCost.toLocaleString()}</td>
                {consumerLoanOption && <td className={`px-6 py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.totalCost.toLocaleString()}</td>}
                {showUserSelection && <td className="px-6 py-4 text-foreground text-center">€{userSelection.totalCost.toLocaleString()}</td>}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
