import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AmortizationEntry } from '@/lib/calculations/mortgage';

interface AmortizationChartProps {
  data: AmortizationEntry[];
}

export function AmortizationChart({ data }: AmortizationChartProps) {
  // Downsample data if too large (e.g. 360 months)
  const chartData = data.filter((_, i) => i % 12 === 0 || i === data.length - 1);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(month) => `${Math.floor(month / 12)}y`} 
            label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            tickFormatter={(val) => `€${val / 1000}k`}
          />
          <Tooltip 
            formatter={(value: number) => `€${value.toFixed(0)}`}
            labelFormatter={(month) => `Year ${Math.floor(Number(month) / 12)}`}
          />
          <Legend />
          <Area type="monotone" dataKey="balance" stackId="1" stroke="#64748b" fill="#64748b" name="Loan Balance" />
          <Area type="monotone" dataKey="equity" stackId="2" stroke="#0d9488" fill="#0d9488" name="Equity" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
