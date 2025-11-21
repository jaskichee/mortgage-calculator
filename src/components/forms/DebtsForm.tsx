import React from 'react';
import { useForm, Controller, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { debtsSchema, DebtsFormData } from '@/lib/schemas/debts-schema';
import { Input } from '@/components/ui/Input';
import DesktopDatePicker from '@/components/ui/DesktopDatePicker';
import { Button } from '@/components/ui/Button';

interface DebtsFormProps {
  defaultValues?: Partial<DebtsFormData>;
  onSubmit: (data: DebtsFormData) => void;
  onBack: () => void;
}

export function DebtsForm({ defaultValues, onSubmit, onBack }: DebtsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DebtsFormData>({
    resolver: zodResolver(debtsSchema) as Resolver<DebtsFormData>,
    defaultValues: {
      studentLoans: 0,
      creditCards: 0,
      carLoans: 0,
      otherLoans: 0,
      existingSavings: 0,
      ...defaultValues,
    },
  });

  const values = useWatch({ control });
  const totalMonthlyDebt = (values.studentLoans || 0) + (values.creditCards || 0) + (values.carLoans || 0) + (values.otherLoans || 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Existing Monthly Debt Payments</h3>
        <Input clearOnFocus
          label="Student Loans (€/month)"
          type="number"
          {...register('studentLoans', { valueAsNumber: true })}
          error={errors.studentLoans?.message}
        />
        <Input clearOnFocus
          label="Credit Cards (€/month)"
          type="number"
          {...register('creditCards', { valueAsNumber: true })}
          error={errors.creditCards?.message}
        />
        <Input clearOnFocus
          label="Car Loans (€/month)"
          type="number"
          {...register('carLoans', { valueAsNumber: true })}
          error={errors.carLoans?.message}
        />
        {(values.carLoans || 0) > 0 && (
          <div className="min-w-0">
            <Controller
              control={control}
              name="carLoanEndDate"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DesktopDatePicker
                  label="Date of Last Car Loan Payment"
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          </div>
        )}
        <Input clearOnFocus
          label="Other Loans (€/month)"
          type="number"
          {...register('otherLoans', { valueAsNumber: true })}
          error={errors.otherLoans?.message}
        />
        
        <div className="pt-4 border-t border-border">
          <h3 className="font-medium text-foreground mb-4">Savings</h3>
          <Input clearOnFocus
            label="Current Total Savings (€)"
            type="number"
            {...register('existingSavings', { valueAsNumber: true })}
            error={errors.existingSavings?.message}
            helperText="Total amount currently saved (excluding emergency fund if separate)"
          />
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-md border border-border">
        <p className="text-lg font-semibold text-foreground">Total Monthly Debt Payments: €{totalMonthlyDebt.toFixed(2)}</p>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
        <Button type="submit" className="w-full">Next Step</Button>
      </div>
    </form>
  );
}
