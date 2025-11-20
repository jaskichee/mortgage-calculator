import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expensesSchema, ExpensesFormData } from '@/lib/schemas/expenses-schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ExpensesFormProps {
  defaultValues?: Partial<ExpensesFormData>;
  onSubmit: (data: ExpensesFormData) => void;
  onBack: () => void;
}

export function ExpensesForm({ defaultValues, onSubmit, onBack }: ExpensesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExpensesFormData>({
    resolver: zodResolver(expensesSchema) as any,
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

  const values = watch();
  const totalExpenses = Object.values(values).reduce((acc, val) => acc + (Number(val) || 0), 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Fixed Expenses</h3>
          <Input
            label="Utilities (Electricity, Water, Heating)"
            type="number"
            {...register('utilities', { valueAsNumber: true })}
            error={errors.utilities?.message}
          />
          <Input
            label="Insurance (Life, Home, Car)"
            type="number"
            {...register('insurance', { valueAsNumber: true })}
            error={errors.insurance?.message}
          />
          {watch('insurance') > 0 && (
             <Input
              label="Life Insurance Duration (Years)"
              helperText="If applicable, how many years left? (0 for indefinite)"
              type="number"
              {...register('lifeInsuranceDuration', { valueAsNumber: true })}
              error={errors.lifeInsuranceDuration?.message}
            />
          )}
          <Input
            label="Subscriptions (Phone, Internet, Netflix)"
            type="number"
            {...register('subscriptions', { valueAsNumber: true })}
            error={errors.subscriptions?.message}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Variable Expenses</h3>
          <Input
            label="Groceries & Household Items"
            type="number"
            {...register('groceries', { valueAsNumber: true })}
            error={errors.groceries?.message}
          />
          <Input
            label="Transportation (Fuel, Public Transport)"
            type="number"
            {...register('transportation', { valueAsNumber: true })}
            error={errors.transportation?.message}
          />
          <Input
            label="Entertainment & Dining Out"
            type="number"
            {...register('entertainment', { valueAsNumber: true })}
            error={errors.entertainment?.message}
          />
          <Input
            label="Other Expenses"
            type="number"
            {...register('other', { valueAsNumber: true })}
            error={errors.other?.message}
          />
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-md border border-border">
        <p className="text-lg font-semibold text-foreground">Total Monthly Expenses: €{totalExpenses.toFixed(2)}</p>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
        <Button type="submit" className="w-full">Next Step</Button>
      </div>
    </form>
  );
}
