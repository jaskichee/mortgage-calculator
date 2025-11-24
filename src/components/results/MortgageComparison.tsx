'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';

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
  collateral?: MortgageOption;
  userSelection?: MortgageOption;
  consumerLoanOption?: MortgageOption;
}

export function MortgageComparison({ standard, collateral, userSelection, consumerLoanOption }: MortgageComparisonProps) {
  const t = useTranslations('Results.comparison');
  const [showConsumerDetails, setShowConsumerDetails] = useState(false);

  const showUserSelection = userSelection && 
    userSelection.downPayment !== standard.downPayment && 
    (!collateral || userSelection.downPayment !== collateral.downPayment);

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
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-white/10">
              <tr>
                <th className="px-3 py-2 sm:px-6 sm:py-3">{t('metric')}</th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-center">{t('standard')}</th>
                {collateral && <th className="px-3 py-2 sm:px-6 sm:py-3 text-center">{t('collateral')}</th>}
                {consumerLoanOption && <th className={`px-3 py-2 sm:px-6 sm:py-3 text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>{t('consumerLoan')}</th>}
                {showUserSelection && <th className="px-3 py-2 sm:px-6 sm:py-3 text-center">{t('userSelection')}</th>}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-card border-b border-border">
                <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('downPayment')}</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{standard.downPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                {collateral && <td className="px-3 py-2 sm:px-6 sm:py-4 font-bold text-emerald-600 dark:text-emerald-400 text-center">€{collateral.downPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {consumerLoanOption && <td className={`px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.downPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {showUserSelection && <td className="px-3 py-2 sm:px-6 sm:py-4 text-primary font-bold text-center">€{userSelection.downPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
              </tr>
              <tr className="bg-card border-b border-border">
                <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('loanAmount')}</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{standard.loanAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                {collateral && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{collateral.loanAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {consumerLoanOption && <td className={`px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.loanAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {showUserSelection && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{userSelection.loanAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
              </tr>
              <tr className="bg-card border-b border-border">
                <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('loanTerm')}</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">{t('years', { count: standard.loanTerm })}</td>
                {collateral && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">{t('years', { count: collateral.loanTerm })}</td>}
                {consumerLoanOption && <td className={`px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>{t('years', { count: consumerLoanOption.loanTerm })}</td>}
                {showUserSelection && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">{t('years', { count: userSelection.loanTerm })}</td>}
              </tr>
              <tr 
                className="bg-card border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setShowConsumerDetails(!showConsumerDetails)}
                title="Click to toggle consumer loan details"
              >
                <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground flex items-center gap-2">
                  {t('monthlyPayment')}
                  <span className={`text-[10px] text-muted-foreground ${toggleVisibilityClass}`}>{showConsumerDetails ? '▲' : '▼'}</span>
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{standard.monthlyPayment.toFixed(2)}</td>
                {collateral && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{collateral.monthlyPayment.toFixed(2)}</td>}
                {consumerLoanOption && <td className={`px-3 py-2 sm:px-6 sm:py-4 text-foreground font-bold text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.monthlyPayment.toFixed(2)}</td>}
                {showUserSelection && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{userSelection.monthlyPayment.toFixed(2)}</td>}
              </tr>
              
              {/* Consumer Loan Breakdown */}
              {showConsumerDetails && (consumerLoanOption?.consumerLoanMonthlyPayment || userSelection?.consumerLoanMonthlyPayment) && (
                <>
                  <tr className="bg-muted/20 border-b border-border">
                    <td className="px-3 py-1 sm:px-6 sm:py-1 font-medium text-muted-foreground pl-6 sm:pl-10 text-xs">{t('consumerLoanPart')}</td>
                    <td className="px-3 py-1 sm:px-6 sm:py-1 text-muted-foreground text-xs text-center">-</td>
                    {collateral && <td className="px-3 py-1 sm:px-6 sm:py-1 text-muted-foreground text-xs text-center">-</td>}
                    {consumerLoanOption && <td className={`px-3 py-1 sm:px-6 sm:py-1 text-foreground text-xs text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.consumerLoanMonthlyPayment?.toFixed(2)}</td>}
                    {showUserSelection && <td className="px-3 py-1 sm:px-6 sm:py-1 text-foreground text-xs text-center">{userSelection?.consumerLoanMonthlyPayment ? `€${userSelection.consumerLoanMonthlyPayment.toFixed(2)}` : '-'}</td>}
                  </tr>
                  <tr className="bg-muted/20 border-b border-border">
                    <td className="px-3 py-1 sm:px-6 sm:py-1 font-medium text-muted-foreground pl-6 sm:pl-10 text-xs">{t('consumerLoanRate')}</td>
                    <td className="px-3 py-1 sm:px-6 sm:py-1 text-muted-foreground text-xs text-center">-</td>
                    {collateral && <td className="px-3 py-1 sm:px-6 sm:py-1 text-muted-foreground text-xs text-center">-</td>}
                    {consumerLoanOption && <td className={`px-3 py-1 sm:px-6 sm:py-1 text-foreground text-xs text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>{consumerLoanOption.consumerLoanRate}%</td>}
                    {showUserSelection && <td className="px-3 py-1 sm:px-6 sm:py-1 text-foreground text-xs text-center">{userSelection?.consumerLoanRate ? `${userSelection.consumerLoanRate}%` : '-'}</td>}
                  </tr>
                  <tr className="bg-muted/20 border-b border-border">
                    <td className="px-3 py-1 sm:px-6 sm:py-1 font-medium text-muted-foreground pl-6 sm:pl-10 text-xs">{t('consumerLoanLength')}</td>
                    <td className="px-3 py-1 sm:px-6 sm:py-1 text-muted-foreground text-xs text-center">-</td>
                    {collateral && <td className="px-3 py-1 sm:px-6 sm:py-1 text-muted-foreground text-xs text-center">-</td>}
                    {consumerLoanOption && <td className={`px-3 py-1 sm:px-6 sm:py-1 text-foreground text-xs text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>{t('years', { count: consumerLoanOption.consumerLoanTerm ?? 0 })}</td>}
                    {showUserSelection && <td className="px-3 py-1 sm:px-6 sm:py-1 text-foreground text-xs text-center">{userSelection?.consumerLoanTerm ? t('years', { count: userSelection.consumerLoanTerm }) : '-'}</td>}
                  </tr>
                </>
              )}

              <tr className="bg-card border-b border-border">
                <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('totalInterest')}</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{standard.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                {collateral && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{collateral.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {consumerLoanOption && <td className={`px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {showUserSelection && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{userSelection.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
              </tr>
              <tr className="bg-card">
                <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('totalCost')}</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{standard.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                {collateral && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{collateral.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {consumerLoanOption && <td className={`px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center ${isConsumerSelected ? '' : 'hidden sm:table-cell'}`}>€{consumerLoanOption.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                {showUserSelection && <td className="px-3 py-2 sm:px-6 sm:py-4 text-foreground text-center">€{userSelection.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
