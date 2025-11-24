import { useState, useEffect } from 'react';
import { CalculatorData } from '@/lib/types';
import { useRouter } from '@/navigation';

export function useCalculatorData() {
  const [data, setData] = useState<CalculatorData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedData = localStorage.getItem('mortgage_calculator_data');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData, (key, value) => {
            if (key === 'birthDate' || key === 'carLoanEndDate') return new Date(value);
            return value;
          });
          setData(parsed);
        } catch (e) {
          console.error('Failed to parse data', e);
          router.push('/calculator');
        }
      } else {
        router.push('/calculator');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  return data;
}
