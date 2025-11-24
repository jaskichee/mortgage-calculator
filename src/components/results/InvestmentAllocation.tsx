import React from 'react';
import { useTranslations } from 'next-intl';
import { InvestmentAllocationResult } from '@/lib/calculations/investment';

interface InvestmentAllocationProps {
  allocation: InvestmentAllocationResult;
}

export function InvestmentAllocation({ allocation }: InvestmentAllocationProps) {
  const t = useTranslations('Results.investmentAllocation');

  return (
    <div className="space-y-6">
      {!allocation.isEmergencyFundFunded ? (
        <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm">
          <h4 className="font-semibold text-primary mb-2">{t('priorityTitle')}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {t('priorityDesc')}
          </p>
          <div className="flex justify-between items-center text-sm text-foreground">
            <span>{t('monthlyContribution')}:</span>
            <span className="font-bold">€{allocation.monthlyToEmergencyFund.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1 text-foreground">
            <span>{t('timeToGoal')}:</span>
            <span className="font-bold">{allocation.monthsToEmergencyFundTarget} {t('months')}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm">
            <h4 className="font-semibold text-secondary mb-2">{t('completeTitle')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('completeDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('etfs')}</div>
              <div className="text-xl font-bold text-foreground">€{allocation.monthlyToETF.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('perMonth')}</div>
            </div>
            <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('savings')}</div>
              <div className="text-xl font-bold text-foreground">€{allocation.monthlyToSavings.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('perMonth')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
