'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const STEPS = [
  { id: 'income', title: 'Household Income', description: 'Enter your monthly net income details' },
  { id: 'expenses', title: 'Monthly Expenses', description: 'Estimate your regular monthly spending' },
  { id: 'mortgage', title: 'Mortgage Details', description: 'Loan amount, interest rate, and terms' },
  { id: 'children', title: 'Children', description: 'Add children to estimate future costs' },
  { id: 'debts', title: 'Debts & Savings', description: 'Existing loans and current savings' },
  { id: 'investment', title: 'Investment Preferences', description: 'Plan your emergency fund and investments' },
] as const;

export default function CalculatorPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<CalculatorData>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const handleInit = () => {
      const storedData = localStorage.getItem('mortgage_calculator_data');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData, (key, value) => {
            if (key === 'birthDate' || key === 'carLoanEndDate') return new Date(value);
            return value;
          });
          setFormData(parsed);
        } catch (e) {
          console.error('Failed to parse stored data', e);
        }
      }

      // Check URL params for reset/edit/step
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('reset') === 'true') {
          // Clear existing storage and reset local state
          localStorage.removeItem('mortgage_calculator_data');
          setFormData({});
          setCurrentStepIndex(0);
          setResetKey(prev => prev + 1);
        } else if (params.get('edit') === 'true') {
          // If editing, attempt to open the first incomplete step
          if (storedData) {
            const parsed = JSON.parse(storedData);
            const firstMissing = STEPS.findIndex(s => !(parsed && parsed[s.id]));
            if (firstMissing >= 0) setCurrentStepIndex(firstMissing);
          }
        }

        const stepParam = params.get('step');
        if (stepParam) {
          const idx = STEPS.findIndex(s => s.id === stepParam);
          if (idx >= 0) setCurrentStepIndex(idx);
        }
      } catch {
        // ignore URL parsing errors
      }

      setIsLoaded(true);
    };

    handleInit();
  }, []);

  const currentStep = STEPS[currentStepIndex];

  const handleNext = (stepData: CalculatorData[keyof CalculatorData]) => {
    const updatedData = { ...formData, [currentStep.id]: stepData } as Partial<CalculatorData>;
    setFormData(updatedData);

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Final step - save and redirect
      setIsSubmitting(true);
      localStorage.setItem('mortgage_calculator_data', JSON.stringify(updatedData));
      
      // Small delay for better UX
      setTimeout(() => {
        router.push('/results');
      }, 1000);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data and start over?')) {
      localStorage.removeItem('mortgage_calculator_data');
      setFormData({});
      setCurrentStepIndex(0);
      setResetKey(prev => prev + 1);
    }
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-foreground">Calculating Results...</h2>
        <p className="text-muted-foreground mt-2">Analyzing your affordability scenarios</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Mortgage Calculator</h1>
            <p className="text-muted-foreground">Plan your financial future with precision</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStepIndex + 1} <span className="text-muted-foreground/50">/</span> {STEPS.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-3 text-xs">
              Reset
            </Button>
          </div>
        </div>
        
        {/* Progress Bar - Liquid Design */}
        <div className="relative h-2 w-full bg-secondary/50 rounded-full overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`, boxShadow: '0 6px 18px rgba(0,0,0,0.08)'}}
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
