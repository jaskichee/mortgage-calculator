import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investmentSchema, InvestmentFormData } from '@/lib/schemas/investment-schema';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';

interface InvestmentPreferencesFormProps {
  defaultValues?: Partial<InvestmentFormData>;
  onSubmit: (data: InvestmentFormData) => void;
  onBack: () => void;
}

export function InvestmentPreferencesForm({ defaultValues, onSubmit, onBack }: InvestmentPreferencesFormProps) {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema) as any,
    defaultValues: {
      emergencyFundMonths: 3,
      etfAllocation: 50,
      ...defaultValues,
    },
  });

  const emergencyFundMonths = watch('emergencyFundMonths');
  const etfAllocation = watch('etfAllocation');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-foreground mb-4">Emergency Fund Target</h3>
          <Slider
            label="Months of Expenses to Cover"
            min={3}
            max={6}
            step={1}
            value={emergencyFundMonths}
            valueDisplay={`${emergencyFundMonths} Months`}
            {...register('emergencyFundMonths', { valueAsNumber: true })}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Recommended: 3-6 months of essential expenses saved before investing.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground mb-4">Surplus Income Allocation</h3>
          <Slider
            label="ETF / Savings Split"
            min={0}
            max={100}
            step={5}
            value={etfAllocation}
            valueDisplay={`${etfAllocation}% ETF / ${100 - etfAllocation}% Savings`}
            {...register('etfAllocation', { valueAsNumber: true })}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>More Savings (Low Risk)</span>
            <span>More ETFs (Higher Growth)</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
        <Button type="submit" className="w-full text-sm sm:text-base">Calculate Results</Button>
      </div>
    </form>
  );
}
