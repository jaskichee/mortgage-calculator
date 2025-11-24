import React from 'react';
import { useTranslations } from 'next-intl';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AmortizationEntry } from '@/lib/calculations/mortgage';

interface AmortizationChartProps {
  data: AmortizationEntry[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    name: string;
    color: string;
  }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const t = useTranslations('Results.charts.amortizationChart');
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/80 backdrop-blur-xl border border-border p-3 rounded-xl shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{t('year', { year: Math.floor(Number(label) / 12) })}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono text-foreground">€{Number(entry.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AmortizationChart({ data }: AmortizationChartProps) {
  const t = useTranslations('Results.charts.amortizationChart');
  // Downsample data if too large (e.g. 360 months)
  const chartData = data.filter((_, i) => i % 12 === 0 || i === data.length - 1);

  return (
    <div className="h-64 sm:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="month" 
            tickFormatter={(month) => `${Math.floor(month / 12)}y`} 
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
            dy={10}
          />
          <YAxis 
            tickFormatter={(val) => `€${val / 1000}k`}
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stackId="1" 
            stroke="#94a3b8" 
            fill="url(#colorBalance)" 
            name={t('balance')} 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="equity" 
            stackId="2" 
            stroke="#2dd4bf" 
            fill="url(#colorEquity)" 
            name={t('equity')} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
