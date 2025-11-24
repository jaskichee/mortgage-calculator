import React from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getExpensesSchema, ExpensesFormData } from '@/lib/schemas/expenses-schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface ExpensesFormProps {
  defaultValues?: Partial<ExpensesFormData>;
  onSubmit: (data: ExpensesFormData) => void;
  onBack: () => void;
}

export function ExpensesForm({ defaultValues, onSubmit, onBack }: ExpensesFormProps) {
  const t = useTranslations('Calculator.expenses');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const schema = getExpensesSchema(tValidation);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ExpensesFormData>({
    resolver: zodResolver(schema) as Resolver<ExpensesFormData>,
    defaultValues: {
      utilities: 0,
      insurance: 0,
      subscriptions: 0,
      groceries: 0,
      transportation: 0,
      entertainment: 0,
      other: 0,
      ...defaultValues,
    },
  });

  const values = useWatch({ control });
  const totalExpenses = Object.values(values).reduce((acc: number, val) => acc + (Number(val) || 0), 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">{t('fixed.title')}</h3>
          <Input clearOnFocus
            label={t('fixed.utilities')}
            type="number"
            {...register('utilities', { valueAsNumber: true })}
            error={errors.utilities?.message}
          />
          <Input clearOnFocus
            label={t('fixed.insurance')}
            type="number"
            {...register('insurance', { valueAsNumber: true })}
            error={errors.insurance?.message}
          />
          {(values.insurance || 0) > 0 && (
             <Input clearOnFocus
              label={t('fixed.lifeInsuranceDuration')}
              helperText={t('fixed.lifeInsuranceDurationHelper')}
              type="number"
              {...register('lifeInsuranceDuration', { valueAsNumber: true })}
              error={errors.lifeInsuranceDuration?.message}
            />
          )}
          <Input clearOnFocus
            label={t('fixed.subscriptions')}
            type="number"
            {...register('subscriptions', { valueAsNumber: true })}
            error={errors.subscriptions?.message}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-foreground">{t('variable.title')}</h3>
          <Input clearOnFocus
            label={t('variable.groceries')}
            type="number"
            {...register('groceries', { valueAsNumber: true })}
            error={errors.groceries?.message}
          />
          <Input clearOnFocus
            label={t('variable.transportation')}
            type="number"
            {...register('transportation', { valueAsNumber: true })}
            error={errors.transportation?.message}
          />
          <Input clearOnFocus
            label={t('variable.entertainment')}
            type="number"
            {...register('entertainment', { valueAsNumber: true })}
            error={errors.entertainment?.message}
          />
          <Input clearOnFocus
            label={t('variable.other')}
            type="number"
            {...register('other', { valueAsNumber: true })}
            error={errors.other?.message}
          />
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-md border border-border">
        <p className="text-lg font-semibold text-foreground">{t('total')}: €{totalExpenses.toFixed(2)}</p>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">{tCommon('back')}</Button>
        <Button type="submit" className="w-full">{tCommon('nextStep')}</Button>
      </div>
    </form>
  );
}
