import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { debtsSchema, DebtsFormData } from '@/lib/schemas/debts-schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface DebtsFormProps {
  defaultValues?: Partial<DebtsFormData>;
  onSubmit: (data: DebtsFormData) => void;
  onBack: () => void;
}

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}. ${m}. ${y}`;
}

function parseDate(str: string): Date | undefined {
  const parts = str.split(/[. ]+/).filter(Boolean);
  if (parts.length !== 3) return undefined;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const y = parseInt(parts[2], 10);
  
  if (isNaN(d) || isNaN(m) || isNaN(y)) return undefined;
  
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return undefined;
  
  return date;
}

const DateInput = ({ value, onChange, error, label }: { value: Date | undefined, onChange: (d: Date | undefined) => void, error?: string, label: string }) => {
  const [inputValue, setInputValue] = React.useState(value ? formatDate(value) : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const date = parseDate(val);
    onChange(date);
  };

  return (
    <Input
      label={label}
      type="text"
      placeholder="DD. MM. YYYY"
      value={inputValue}
      onChange={handleChange}
      error={error}
      helperText="Format: DD. MM. YYYY"
    />
  );
};

export function DebtsForm({ defaultValues, onSubmit, onBack }: DebtsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<DebtsFormData>({
    resolver: zodResolver(debtsSchema) as any,
    defaultValues: {
      studentLoans: 0,
      creditCards: 0,
      carLoans: 0,
      otherLoans: 0,
      existingSavings: 0,
      ...defaultValues,
    },
  });

  const values = watch();
  const totalMonthlyDebt = (values.studentLoans || 0) + (values.creditCards || 0) + (values.carLoans || 0) + (values.otherLoans || 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Existing Monthly Debt Payments</h3>
        <Input
          label="Student Loans (€/month)"
          type="number"
          {...register('studentLoans', { valueAsNumber: true })}
          error={errors.studentLoans?.message}
        />
        <Input
          label="Credit Cards (€/month)"
          type="number"
          {...register('creditCards', { valueAsNumber: true })}
          error={errors.creditCards?.message}
        />
        <Input
          label="Car Loans (€/month)"
          type="number"
          {...register('carLoans', { valueAsNumber: true })}
          error={errors.carLoans?.message}
        />
        {watch('carLoans') > 0 && (
          <Controller
            control={control}
            name="carLoanEndDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DateInput
                label="Date of Last Car Loan Payment"
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
        )}
        <Input
          label="Other Loans (€/month)"
          type="number"
          {...register('otherLoans', { valueAsNumber: true })}
          error={errors.otherLoans?.message}
        />
        
        <div className="pt-4 border-t border-border">
          <h3 className="font-medium text-foreground mb-4">Savings</h3>
          <Input
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
