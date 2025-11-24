'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from '@/navigation';
import { CalculatorData } from '@/lib/types';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { ExpensesForm } from '@/components/forms/ExpensesForm';
import { MortgageForm } from '@/components/forms/MortgageForm';
import { ChildrenForm } from '@/components/forms/ChildrenForm';
import { DebtsForm } from '@/components/forms/DebtsForm';
import { InvestmentPreferencesForm } from '@/components/forms/InvestmentPreferencesForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCalculatorPersistence } from '@/hooks/useCalculatorPersistence';

const STEPS_IDS = ['income', 'expenses', 'mortgage', 'children', 'debts', 'investment'] as const;

export default function CalculatorPage() {
  const t = useTranslations('Calculator.steps');
  const tCalc = useTranslations('Calculator');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = useMemo(() => STEPS_IDS.map(id => ({
    id,
    title: t(`${id}.title`),
    description: t(`${id}.description`)
  })), [t]);

  const {
    formData,
    setFormData,
    currentStepIndex,
    setCurrentStepIndex,
    isLoaded,
    resetKey,
    setResetKey,
  } = useCalculatorPersistence(steps);

  const currentStep = steps[currentStepIndex];

  const handleNext = (stepData: CalculatorData[keyof CalculatorData]) => {
    const updatedData = { ...formData, [currentStep.id]: stepData } as Partial<CalculatorData>;
    setFormData(updatedData);
    localStorage.setItem('mortgage_calculator_data', JSON.stringify(updatedData));

    if (currentStepIndex < steps.length - 1) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      localStorage.setItem('mortgage_calculator_step', nextStep.toString());
    } else {
      // Final step - save and redirect
      setIsSubmitting(true);
      
      // Small delay for better UX
      setTimeout(() => {
        router.push('/results');
      }, 1000);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      setCurrentStepIndex(prevStep);
      localStorage.setItem('mortgage_calculator_step', prevStep.toString());
    }
  };

  const handleReset = () => {
    if (confirm(tCalc('resetConfirm'))) {
      localStorage.removeItem('mortgage_calculator_data');
      localStorage.removeItem('mortgage_calculator_step');
      setFormData({});
      setCurrentStepIndex(0);
      setResetKey(prev => prev + 1);
    }
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">{tCommon('loading')}</div>;
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-foreground">{tCalc('calculating')}</h2>
        <p className="text-muted-foreground mt-2">{tCalc('analyzing')}</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep.id) {
      case 'income':
        return <IncomeForm defaultValues={formData.income} onSubmit={handleNext} />;
      case 'expenses':
        return <ExpensesForm defaultValues={formData.expenses} onSubmit={handleNext} onBack={handleBack} />;
      case 'mortgage':
        return <MortgageForm defaultValues={formData.mortgage} onSubmit={handleNext} onBack={handleBack} />;
      case 'children':
        return <ChildrenForm defaultValues={formData.children} onSubmit={handleNext} onBack={handleBack} />;
      case 'debts':
        return <DebtsForm defaultValues={formData.debts} onSubmit={handleNext} onBack={handleBack} />;
      case 'investment':
        return <InvestmentPreferencesForm defaultValues={formData.investment} onSubmit={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-full sm:max-w-3xl relative z-10">
      <div className="mb-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{tCalc('title')}</h1>
            <p className="text-muted-foreground">{tCalc('subtitle')}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {tCalc('step')} {currentStepIndex + 1} <span className="text-muted-foreground/50">/</span> {steps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-3 text-xs">
              {tCalc('reset')}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar - Liquid Design */}
        <div className="relative h-2 w-full bg-secondary/50 rounded-full overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%`, boxShadow: '0 6px 18px rgba(0,0,0,0.08)'}}
          />
        </div>
      </div>

      <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
          <CardDescription className="text-base">{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent key={resetKey}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
