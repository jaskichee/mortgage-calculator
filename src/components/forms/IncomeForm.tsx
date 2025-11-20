import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { incomeSchema, IncomeFormData } from '@/lib/schemas/income-schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface IncomeFormProps {
  defaultValues?: Partial<IncomeFormData>;
  onSubmit: (data: IncomeFormData) => void;
}

export function IncomeForm({ defaultValues, onSubmit }: IncomeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema) as any,
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
  const otherLabel = workingMembersCount > 2 ? "Total Monthly Net Income (All Others)" : "Monthly Net Income (2nd Member)";
  const otherBonusLabel = workingMembersCount > 2 ? "Total Annual Bonuses (All Others)" : "Annual Bonuses (2nd Member)";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <Input clearOnFocus
          label="Number of Working Household Members"
          type="number"
          min={1}
          {...register('workingMembersCount', { 
            valueAsNumber: true,
            min: { value: 1, message: "Must be at least 1" }
          })}
          error={errors.workingMembersCount?.message}
        />

        <div className="space-y-4 p-4 border border-border rounded-md bg-muted/20">
          <h3 className="font-medium text-foreground">Primary Applicant</h3>
          <Input clearOnFocus
            label="Monthly Net Income (€)"
            type="number"
            {...register('primaryIncome', { valueAsNumber: true })}
            error={errors.primaryIncome?.message}
          />
          <Input clearOnFocus
            label="Annual Bonuses (Vacation + Christmas) (€)"
            helperText="Total annual amount of Regres + Božičnica (Net)"
            type="number"
            {...register('primaryBonuses', { valueAsNumber: true })}
            error={errors.primaryBonuses?.message}
          />
        </div>
        
        {workingMembersCount > 1 && (
          <div className="space-y-4 p-4 border border-border rounded-md bg-muted/20">
            <h3 className="font-medium text-foreground">Other Household Members {workingMembersCount > 2 ? `(Total for ${workingMembersCount - 1} people)` : ''}</h3>
            <Input clearOnFocus
              label={otherLabel}
              type="number"
              {...register('otherIncome', { valueAsNumber: true })}
              error={errors.otherIncome?.message}
            />
            <Input clearOnFocus
              label={otherBonusLabel}
              helperText="Total annual amount of Regres + Božičnica (Net)"
              type="number"
              {...register('otherBonuses', { valueAsNumber: true })}
              error={errors.otherBonuses?.message}
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">Next Step</Button>
    </form>
  );
}
