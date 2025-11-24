import React from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getInvestmentSchema, InvestmentFormData } from '@/lib/schemas/investment-schema';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface InvestmentPreferencesFormProps {
  defaultValues?: Partial<InvestmentFormData>;
  onSubmit: (data: InvestmentFormData) => void;
  onBack: () => void;
}

export function InvestmentPreferencesForm({ defaultValues, onSubmit, onBack }: InvestmentPreferencesFormProps) {
  const t = useTranslations('Calculator.investment');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const schema = getInvestmentSchema(tValidation);

  const {
    register,
    handleSubmit,
    control,
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(schema) as Resolver<InvestmentFormData>,
    defaultValues: {
      emergencyFundMonths: 3,
      etfAllocation: 50,
      ...defaultValues,
    },
  });

  const emergencyFundMonths = useWatch({
    control,
    name: 'emergencyFundMonths',
    defaultValue: defaultValues?.emergencyFundMonths || 3,
  });
  const etfAllocation = useWatch({
    control,
    name: 'etfAllocation',
    defaultValue: defaultValues?.etfAllocation || 50,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-foreground mb-4">{t('emergencyFund.title')}</h3>
          <Slider
            label={t('emergencyFund.label')}
            min={3}
            max={6}
            step={1}
            value={emergencyFundMonths}
            valueDisplay={`${emergencyFundMonths} ${tCommon('months')}`}
            {...register('emergencyFundMonths', { valueAsNumber: true })}
          />
          <p className="text-sm text-muted-foreground mt-2">
            {t('emergencyFund.helper')}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground mb-4">{t('allocation.title')}</h3>
          <Slider
            label={t('allocation.label')}
            min={0}
            max={100}
            step={5}
            value={etfAllocation}
            valueDisplay={`${etfAllocation}% ETF / ${100 - etfAllocation}% ${t('allocation.savings')}`}
            {...register('etfAllocation', { valueAsNumber: true })}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{t('allocation.lowRisk')}</span>
            <span>{t('allocation.highRisk')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">{tCommon('back')}</Button>
        <Button type="submit" className="w-full text-sm sm:text-base">{t('submit')}</Button>
      </div>
    </form>
  );
}
