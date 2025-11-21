import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
}

export function SummaryCard({ title, value, description, status = 'neutral' }: SummaryCardProps) {
  const statusColors = {
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
    neutral: 'text-foreground',
  };

  const displayValue = (typeof value === 'number' && isNaN(value)) || value === '€NaN' ? '€0.00' : value;

  return (
    <Card>
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-sm font-medium text-muted-foreground h-10 flex items-center justify-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className={`text-2xl font-bold ${statusColors[status]}`}>{displayValue}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
