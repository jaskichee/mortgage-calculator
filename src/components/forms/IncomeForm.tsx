import React from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getIncomeSchema, IncomeFormData } from '@/lib/schemas/income-schema';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface IncomeFormProps {
  defaultValues?: Partial<IncomeFormData>;
  onSubmit: (data: IncomeFormData) => void;
}

export function IncomeForm({ defaultValues, onSubmit }: IncomeFormProps) {
  const t = useTranslations('Calculator.income');
  const tValidation = useTranslations('Validation');
  const schema = getIncomeSchema(tValidation);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(schema) as Resolver<IncomeFormData>,
    defaultValues: {
      primaryIncome: 0,
      primaryBonuses: 0,
      otherIncome: 0,
      otherBonuses: 0,
      workingMembersCount: 1,
      ...defaultValues,
    },
  });

  const workingMembersCount = useWatch({
    control,
    name: 'workingMembersCount',
    defaultValue: defaultValues?.workingMembersCount || 1,
  });

  React.useEffect(() => {
    if (workingMembersCount <= 1) {
      setValue('otherIncome', 0);
      setValue('otherBonuses', 0);
    }
  }, [workingMembersCount, setValue]);

  // Local state to manage individual other incomes if count > 2
  // For simplicity, we'll just show the aggregate fields but with a clearer label if count > 2
  // Or better, we render multiple inputs and sum them up.
  
  // Actually, let's just update the label to be plural if count > 2
  const otherLabel = workingMembersCount > 2 ? t('other.netIncomeTotal') : t('other.netIncome');
  const otherBonusLabel = workingMembersCount > 2 ? t('other.bonusesTotal') : t('other.bonuses');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <Slider
          label={t('workingMembers')}
          min={1}
          max={5}
          step={1}
          value={workingMembersCount}
          valueDisplay={workingMembersCount}
          {...register('workingMembersCount', { 
            valueAsNumber: true,
            min: { value: 1, message: "Must be at least 1" }
          })}
        />

        <div className="space-y-4 p-4 border border-border rounded-md bg-muted/20">
          <h3 className="font-medium text-foreground">{t('primary.title')}</h3>
          <Input clearOnFocus
            label={t('primary.netIncome')}
            type="number"
            {...register('primaryIncome', { valueAsNumber: true })}
            error={errors.primaryIncome?.message}
          />
          <Input clearOnFocus
            label={t('primary.bonuses')}
            helperText={t('primary.bonusesHelper')}
            type="number"
            {...register('primaryBonuses', { valueAsNumber: true })}
            error={errors.primaryBonuses?.message}
          />
        </div>
        
        {workingMembersCount > 1 && (
          <div className="space-y-4 p-4 border border-border rounded-md bg-muted/20">
            <h3 className="font-medium text-foreground">{workingMembersCount > 2 ? t('other.titleTotal', { count: workingMembersCount - 1 }) : t('other.title')}</h3>
            <Input clearOnFocus
              label={otherLabel}
              type="number"
              {...register('otherIncome', { valueAsNumber: true })}
              error={errors.otherIncome?.message}
            />
            <Input clearOnFocus
              label={otherBonusLabel}
              helperText={t('other.bonusesHelper')}
              type="number"
              {...register('otherBonuses', { valueAsNumber: true })}
              error={errors.otherBonuses?.message}
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">{t('submit')}</Button>
    </form>
  );
}
