import React from 'react';
import { useWatch, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { MortgageFormData } from '@/lib/schemas/mortgage-schema';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { useTranslations } from 'next-intl';

interface CollateralSectionProps {
  control: Control<MortgageFormData>;
  register: UseFormRegister<MortgageFormData>;
  errors: FieldErrors<MortgageFormData>;
  homePrice: number;
  needsCollateral: boolean;
}

export function CollateralSection({
  control,
  register,
  errors,
  homePrice,
  needsCollateral,
}: CollateralSectionProps) {
  const t = useTranslations('Calculator.mortgage');
  const tCommon = useTranslations('Common');

  const [
    additionalResourceMethod,
    useCollateral,
    parentPropertyValue,
    consumerLoanTerm,
  ] = useWatch({
    control,
    name: [
      'additionalResourceMethod',
      'useCollateral',
      'parentPropertyValue',
      'consumerLoanTerm',
    ],
  });

  // Real-time validation feedback for collateral
  const isCollateralSufficient =
    (additionalResourceMethod === 'collateral' ||
      additionalResourceMethod === 'guarantor' ||
      useCollateral) &&
    parentPropertyValue &&
    homePrice
      ? parentPropertyValue * 0.8 >= homePrice * 0.2
      : true;

  if (!needsCollateral) return null;

  return (
    <div className="p-6 bg-card border-2 border-primary/10 rounded-xl shadow-sm space-y-6">
      <div className="space-y-2">
        <div className="text-base font-semibold text-foreground flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-bold">
            !
          </span>
          {t('collateral.title')}
        </div>
        <p className="text-sm text-muted-foreground">
          {t('collateral.description')}
        </p>
      </div>

      <div className="space-y-4">
        <select
          className="w-full p-2 rounded-md border border-input bg-background text-foreground"
          {...register('additionalResourceMethod')}
        >
          <option value="none">{t('collateral.options.none')}</option>
          <option value="consumerLoan">
            {t('collateral.options.consumerLoan')}
          </option>
          <option value="guarantor">{t('collateral.options.guarantor')}</option>
        </select>

        {(additionalResourceMethod === 'collateral' ||
          additionalResourceMethod === 'guarantor') && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Input
              label={t('collateral.parentProperty')}
              type="number"
              {...register('parentPropertyValue', { valueAsNumber: true })}
              error={errors.parentPropertyValue?.message}
            />
            {!isCollateralSufficient && (
              <p className="text-sm text-destructive font-medium">
                {t('collateral.insufficientCollateral', {
                  amount: ((homePrice || 0) * 0.2 / 0.8).toFixed(0),
                })}
              </p>
            )}
          </div>
        )}

        {additionalResourceMethod === 'consumerLoan' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 p-4 bg-muted/30 rounded-lg">
            <Input
              clearOnFocus
              label={t('collateral.consumerLoanRate')}
              type="number"
              step="0.1"
              {...register('consumerLoanInterestRate', { valueAsNumber: true })}
            />
            <Slider
              label={t('collateral.consumerLoanTerm')}
              min={1}
              max={10}
              step={1}
              value={consumerLoanTerm || 10}
              valueDisplay={`${consumerLoanTerm} ${tCommon('years')}`}
              {...register('consumerLoanTerm', { valueAsNumber: true })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
