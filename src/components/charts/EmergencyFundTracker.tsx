import React from 'react';
import { useTranslations } from 'next-intl';

interface EmergencyFundTrackerProps {
  currentSavings: number;
  targetAmount: number;
  monthlyContribution: number;
}

export function EmergencyFundTracker({ currentSavings, targetAmount, monthlyContribution }: EmergencyFundTrackerProps) {
  const t = useTranslations('Results.emergencyFund');
  const progress = Math.min(100, (currentSavings / targetAmount) * 100);
  const shortfall = Math.max(0, targetAmount - currentSavings);
  const monthsToGoal = monthlyContribution > 0 ? Math.ceil(shortfall / monthlyContribution) : Infinity;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-muted-foreground">{t('currentSavings')}</div>
          <div className="text-2xl font-bold text-foreground">€{currentSavings.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{t('targetGoal')}</div>
          <div className="text-2xl font-bold text-foreground">€{targetAmount.toLocaleString()}</div>
        </div>
      </div>

      <div className="w-full bg-secondary/20 rounded-full h-4 overflow-hidden">
        <div 
          className={`h-4 rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-secondary' : 'bg-primary'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="text-muted-foreground">
          {progress.toFixed(1)}{t('funded')}
        </div>
        <div className="text-muted-foreground">
          {progress >= 100 
            ? t('goalReached') 
            : monthlyContribution > 0 
              ? t('monthsToGoal', { months: monthsToGoal }) 
              : t('noContribution')}
        </div>
      </div>
    </div>
  );
}
