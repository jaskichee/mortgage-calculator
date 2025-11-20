import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StressTestResult, ScenarioResult } from '@/lib/calculations/stress-test';

interface StressTestTableProps {
  results: StressTestResult;
  isFixedRate?: boolean;
}

export function StressTestTable({ results, isFixedRate }: StressTestTableProps) {
  const scenarios = [
    results.baseline,
    !isFixedRate ? results.rateIncrease : null,
    results.jobLoss
  ].filter((s): s is ScenarioResult => s !== null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stress Test Scenarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-white/10">
              <tr>
                <th className="px-6 py-3">Metric</th>
                {scenarios.map((s) => (
                  <th key={s.name} className="px-6 py-3">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Monthly Payment</td>
                {scenarios.map((s) => (
                  <td key={s.name} className="px-6 py-4">€{s.monthlyPayment.toFixed(2)}</td>
                ))}
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">DTI Ratio</td>
                {scenarios.map((s) => (
                  <td key={s.name} className={`px-6 py-4 ${s.totalDTI > 40 ? 'text-red-600 font-bold' : 'text-foreground'}`}>
                    {s.totalDTI.toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Monthly Surplus</td>
                {scenarios.map((s) => (
                  <td key={s.name} className={`px-6 py-4 ${s.monthlySurplus < 0 ? 'text-red-600 font-bold' : 'text-foreground'}`}>
                    €{s.monthlySurplus.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="bg-card">
                <td className="px-6 py-4 font-medium text-foreground">Status</td>
                {scenarios.map((s) => (
                  <td key={s.name} className="px-6 py-4">
                    {s.isAffordable ? (
                      <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded">Pass</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Fail</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
