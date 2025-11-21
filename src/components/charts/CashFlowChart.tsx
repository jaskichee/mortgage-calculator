import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CashFlowData {
  name: string;
  Income: number;
  Expenses: number;
  Debts: number;
  Mortgage: number;
  Leftover: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
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
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/80 backdrop-blur-xl border border-border p-3 rounded-xl shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono text-foreground">€{Number(entry.value).toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="h-64 sm:h-full w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="colorDebts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="colorMortgage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
            <linearGradient id="colorLeftover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            unit="€" 
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent)' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="Expenses" stackId="a" fill="url(#colorExpenses)" radius={[0, 0, 4, 4]} />
          <Bar dataKey="Debts" stackId="a" fill="url(#colorDebts)" />
          <Bar dataKey="Mortgage" stackId="a" fill="url(#colorMortgage)" />
          <Bar dataKey="Leftover" stackId="a" fill="url(#colorLeftover)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
