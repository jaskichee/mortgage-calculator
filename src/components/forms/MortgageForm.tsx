import React from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMortgageSchema, MortgageFormData } from '@/lib/schemas/mortgage-schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { useTranslations } from 'next-intl';

import { CollateralSection } from './sections/CollateralSection';

interface MortgageFormProps {
  defaultValues?: Partial<MortgageFormData>;
  onSubmit: (data: MortgageFormData) => void;
  onBack: () => void;
}

export function MortgageForm({ defaultValues, onSubmit, onBack }: MortgageFormProps) {
  const t = useTranslations('Calculator.mortgage');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const schema = getMortgageSchema(tValidation);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<MortgageFormData>({
    resolver: zodResolver(schema) as Resolver<MortgageFormData>,
    defaultValues: {
      homePrice: 0,
      downPayment: 0,
      rateType: 'fixed',
      interestRate: 3.5,
      euribor: 3.0,
      bankMargin: 1.5,
      loanTerm: 30,
      useCollateral: false,
      additionalResourceMethod: 'none',
      parentPropertyValue: 0,
      consumerLoanInterestRate: 6.5,
      consumerLoanTerm: 10,
      ...defaultValues,
    },
  });

  const [
    homePrice,
    downPayment,
    rateType,
    loanTerm,
    additionalResourceMethod,
  ] = useWatch({
    control,
    name: [
      'homePrice',
      'downPayment',
      'rateType',
      'loanTerm',
      'additionalResourceMethod',
    ],
  });

  const ltv = (homePrice || 0) > 0 ? (((homePrice || 0) - (downPayment || 0)) / (homePrice || 0)) * 100 : 0;
  const needsCollateral = ltv > 80;

  // Sync useCollateral with additionalResourceMethod for backward compatibility
  React.useEffect(() => {
    if (needsCollateral) {
      if (additionalResourceMethod === 'collateral') {
        // setValue('useCollateral', true); // Avoid loop if possible, or just rely on additionalResourceMethod
      }
    } else {
      // If collateral is not needed (LTV <= 80%), reset these values
      setValue('useCollateral', false);
      setValue('additionalResourceMethod', 'none');
    }
  }, [additionalResourceMethod, needsCollateral, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input clearOnFocus
          label={t('homePrice')}
          type="number"
          {...register('homePrice', { valueAsNumber: true })}
          error={errors.homePrice?.message}
        />

        <Input clearOnFocus
          label={t('downPayment')}
          type="number"
          {...register('downPayment', { valueAsNumber: true })}
          error={errors.downPayment?.message}
          helperText={t('ltvHelper', { ltv: ltv.toFixed(1), needsCollateral: needsCollateral.toString() })}
        />

        <CollateralSection
          control={control}
          register={register}
          errors={errors}
          homePrice={homePrice || 0}
          needsCollateral={needsCollateral}
        />

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('rateType.label')}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" value="fixed" {...register('rateType')} />
                <span className="text-sm">{t('rateType.fixed')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="variable" {...register('rateType')} />
                <span className="text-sm">{t('rateType.variable')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="combined" {...register('rateType')} disabled />
                <span className="text-sm text-muted-foreground">{t('rateType.combined')}</span>
              </label>
            </div>
          </div>

          {rateType === 'fixed' ? (
            <Input clearOnFocus
              label={t('interestRate')}
              type="number"
              step="0.01"
              {...register('interestRate', { valueAsNumber: true })}
              error={errors.interestRate?.message}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Input clearOnFocus
                label={t('euribor')}
                type="number"
                step="0.01"
                {...register('euribor', { valueAsNumber: true })}
                error={errors.euribor?.message}
              />
              <Input clearOnFocus
                label={t('bankMargin')}
                type="number"
                step="0.01"
                {...register('bankMargin', { valueAsNumber: true })}
                error={errors.bankMargin?.message}
              />
            </div>
          )}

          <Slider
            label={t('loanTerm')}
            min={5}
            max={30}
            step={1}
            value={loanTerm}
            valueDisplay={`${loanTerm} ${tCommon('years')}`}
            {...register('loanTerm', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">{tCommon('back')}</Button>
        <Button type="submit" className="w-full">{tCommon('nextStep')}</Button>
      </div>
    </form>
  );
}
