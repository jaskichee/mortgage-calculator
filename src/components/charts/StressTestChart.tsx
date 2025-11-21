import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StressTestChartProps {
  data: Array<{
    year: number;
    baseline: number;
    rateIncrease: number;
    jobLoss: number;
  }>;
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
        <p className="text-sm font-medium text-foreground mb-2">{`Year ${label}`}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono text-foreground">€{Number(entry.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function StressTestChart({ data }: StressTestChartProps) {
  return (
    <div className="h-64 sm:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Years', position: 'insideBottomRight', offset: -5, fill: 'var(--muted-foreground)' }} 
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 2, opacity: 0.2 }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            dataKey="baseline" 
            stroke="#2dd4bf" 
            name="Baseline" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="rateIncrease" 
            stroke="#facc15" 
            name="Rate +2%" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="jobLoss" 
            stroke="#f87171" 
            name="Job Loss" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
