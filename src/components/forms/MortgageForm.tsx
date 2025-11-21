import React from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mortgageSchema, MortgageFormData } from '@/lib/schemas/mortgage-schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

interface MortgageFormProps {
  defaultValues?: Partial<MortgageFormData>;
  onSubmit: (data: MortgageFormData) => void;
  onBack: () => void;
}

export function MortgageForm({ defaultValues, onSubmit, onBack }: MortgageFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<MortgageFormData>({
    resolver: zodResolver(mortgageSchema) as Resolver<MortgageFormData>,
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

  const values = useWatch({ control });
  const {
    useCollateral,
    additionalResourceMethod,
    homePrice,
    downPayment,
    parentPropertyValue,
    rateType,
    euribor,
    bankMargin,
    consumerLoanTerm,
    loanTerm,
  } = values;

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

  // Real-time validation feedback for collateral
  const isCollateralSufficient = (additionalResourceMethod === 'collateral' || useCollateral) && parentPropertyValue && homePrice 
    ? (parentPropertyValue * 0.80) >= (homePrice * 0.20)
    : true;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input clearOnFocus
          label="Home Price (€)"
          type="number"
          {...register('homePrice', { valueAsNumber: true })}
          error={errors.homePrice?.message}
        />

        <Input clearOnFocus
          label="Down Payment (€)"
          type="number"
          {...register('downPayment', { valueAsNumber: true })}
          error={errors.downPayment?.message}
          helperText={`LTV: ${ltv.toFixed(1)}% ${needsCollateral ? '(Requires Additional Resources)' : ''}`}
        />

        {needsCollateral && (
          <div className="p-6 bg-card border-2 border-primary/10 rounded-xl shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-bold">!</span>
                Additional Resources Required
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                Your down payment is less than 20%. Please select how you would like to cover the difference:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${additionalResourceMethod === 'collateral' ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted bg-transparent'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    value="collateral"
                    {...register('additionalResourceMethod')}
                    className="h-5 w-5 text-primary focus:ring-ring accent-primary"
                  />
                  <span className="font-semibold text-foreground">Collateral Property</span>
                </div>
                <span className="text-xs text-muted-foreground ml-8">Use another property (e.g. parents&apos;) to secure the loan.</span>
              </label>
              
              <label className={`relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${additionalResourceMethod === 'consumerLoan' ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted bg-transparent'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    value="consumerLoan"
                    {...register('additionalResourceMethod')}
                    className="h-5 w-5 text-primary focus:ring-ring accent-primary"
                  />
                  <span className="font-semibold text-foreground">Consumer Loan</span>
                </div>
                <span className="text-xs text-muted-foreground ml-8">Take a separate loan for the down payment gap.</span>
              </label>
            </div>

            {additionalResourceMethod === 'collateral' && (
              <div className="pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 ml-1 border-l-2 border-primary/20 pl-4">
                <Input clearOnFocus
                  label="Collateral Property Value (€)"
                  type="number"
                  {...register('parentPropertyValue', { valueAsNumber: true })}
                  error={errors.parentPropertyValue?.message}
                />
                {!isCollateralSufficient && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200 flex gap-2">
                    <span>⚠️</span>
                    <span>
                      Warning: Collateral value might be insufficient. 
                      Needs to cover 20% of home price (€{((homePrice || 0) * 0.20).toFixed(0)}).
                    </span>
                  </div>
                )}
              </div>
            )}

            {additionalResourceMethod === 'consumerLoan' && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 ml-1 border-l-2 border-primary/20 pl-4 space-y-4">
                <Input clearOnFocus
                  label="Consumer Loan Interest Rate (%)"
                  type="number"
                  step="0.1"
                  {...register('consumerLoanInterestRate', { valueAsNumber: true })}
                  error={errors.consumerLoanInterestRate?.message}
                />
                
                <Slider
                  label="Consumer Loan Term (Years)"
                  min={1}
                  max={20}
                  step={1}
                  valueDisplay={`${consumerLoanTerm} Years`}
                  {...register('consumerLoanTerm', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>
        )}

        {!needsCollateral && (
           <div className="hidden">
             {/* Collateral not needed if LTV <= 80% */}
           </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Interest Rate Type</label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="fixed"
                {...register('rateType')}
                className="h-4 w-4 text-primary focus:ring-ring accent-primary"
              />
              <span className="text-sm text-foreground">Fixed Rate</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="variable"
                {...register('rateType')}
                className="h-4 w-4 text-primary focus:ring-ring accent-primary"
              />
              <span className="text-sm text-foreground">Variable (EURIBOR + Margin)</span>
            </label>
          </div>
        </div>

        {rateType === 'fixed' ? (
          <Input clearOnFocus
            label="Annual Fixed Interest Rate (%)"
            type="number"
            step="0.01"
            {...register('interestRate', { valueAsNumber: true })}
            error={errors.interestRate?.message}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Input clearOnFocus
              label="EURIBOR 6M (%)"
              type="number"
              step="0.01"
              {...register('euribor', { valueAsNumber: true })}
              error={errors.euribor?.message}
            />
            <Input clearOnFocus
              label="Bank Margin (%)"
              type="number"
              step="0.01"
              {...register('bankMargin', { valueAsNumber: true })}
              error={errors.bankMargin?.message}
            />
            <div className="col-span-2 text-sm text-muted-foreground">
              Total Variable Rate: {((euribor || 0) + (bankMargin || 0)).toFixed(2)}%
            </div>
          </div>
        )}

        <Slider
          label="Loan Term (Years)"
          min={5}
          max={30}
          step={1}
          valueDisplay={`${loanTerm} Years`}
          {...register('loanTerm', { valueAsNumber: true })}
        />
        {errors.loanTerm && <p className="mt-1 text-sm text-destructive">{errors.loanTerm.message}</p>}
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
        <Button type="submit" className="w-full">Next Step</Button>
      </div>
    </form>
  );
}
