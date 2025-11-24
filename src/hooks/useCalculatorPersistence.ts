import { useState, useEffect } from 'react';
import { CalculatorData } from '@/lib/types';

interface Step {
  id: string;
  title: string;
  description: string;
}

export function useCalculatorPersistence(steps: Step[]) {
  const [formData, setFormData] = useState<Partial<CalculatorData>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const handleInit = () => {
      const storedData = localStorage.getItem('mortgage_calculator_data');
      const storedStep = localStorage.getItem('mortgage_calculator_step');

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

      if (storedStep) {
        const stepIdx = parseInt(storedStep, 10);
        if (!isNaN(stepIdx) && stepIdx >= 0 && stepIdx < steps.length) {
          setCurrentStepIndex(stepIdx);
        }
      }

      // Check URL params for reset/edit/step
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('reset') === 'true') {
          // Clear existing storage and reset local state
          localStorage.removeItem('mortgage_calculator_data');
          localStorage.removeItem('mortgage_calculator_step');
          setFormData({});
          setCurrentStepIndex(0);
          setResetKey(prev => prev + 1);
        } else if (params.get('edit') === 'true') {
          // If editing, attempt to open the first incomplete step
          if (storedData) {
            const parsed = JSON.parse(storedData);
            const firstMissing = steps.findIndex(s => !(parsed && parsed[s.id]));
            if (firstMissing >= 0) {
              setCurrentStepIndex(firstMissing);
              localStorage.setItem('mortgage_calculator_step', firstMissing.toString());
            }
          }
        }

        const stepParam = params.get('step');
        if (stepParam) {
          const idx = steps.findIndex(s => s.id === stepParam);
          if (idx >= 0) {
            setCurrentStepIndex(idx);
            localStorage.setItem('mortgage_calculator_step', idx.toString());
          }
        }
      } catch {
        // ignore URL parsing errors
      }

      setIsLoaded(true);
    };

    handleInit();
  }, [steps]);

  return {
    formData,
    setFormData,
    currentStepIndex,
    setCurrentStepIndex,
    isLoaded,
    resetKey,
    setResetKey,
  };
}
