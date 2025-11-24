import React from 'react';
import { useTranslations } from 'next-intl';
import { StressTestResult, ScenarioResult } from '@/lib/calculations/stress-test';

interface StressTestTableProps {
  results: StressTestResult;
  isFixedRate?: boolean;
}

export function StressTestTable({ results, isFixedRate }: StressTestTableProps) {
  const t = useTranslations('Results.stressTest');

  const scenarios = [
    { data: results.baseline, id: 'baseline' },
    !isFixedRate ? { data: results.rateIncrease, id: 'rateIncrease' } : null,
    { data: results.jobLoss, id: 'jobLoss' }
  ].filter((s): s is { data: ScenarioResult, id: string } => s !== null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase border-b border-white/10">
          <tr>
            <th className="px-3 py-2 sm:px-6 sm:py-3">{t('metric')}</th>
            {scenarios.map((s) => (
              <th key={s.id} className="px-3 py-2 sm:px-6 sm:py-3 text-center">{t(`scenarios.${s.id}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('monthlyPayment')}</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-3 py-2 sm:px-6 sm:py-4 text-center">€{s.data.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            ))}
          </tr>
          <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('dti')}</td>
            {scenarios.map((s) => (
              <td key={s.id} className={`px-3 py-2 sm:px-6 sm:py-4 text-center ${s.data.totalDTI > 40 ? 'text-red-600 font-bold' : 'text-foreground'}`}>
                {s.data.totalDTI.toFixed(1)}%
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('surplus')}</td>
            {scenarios.map((s) => (
              <td key={s.id} className={`px-3 py-2 sm:px-6 sm:py-4 text-center ${s.data.monthlySurplus < 0 ? 'text-red-600 font-bold' : 'text-foreground'}`}>
                €{s.data.monthlySurplus.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </td>
            ))}
          </tr>
          <tr className="bg-card">
            <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-foreground">{t('status')}</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-3 py-2 sm:px-6 sm:py-4 text-center">
                {s.data.isAffordable ? (
                  <span className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded min-w-[60px]">{t('pass')}</span>
                ) : (
                  <span className="inline-flex items-center justify-center bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium px-2.5 py-0.5 rounded min-w-[60px]">{t('fail')}</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
