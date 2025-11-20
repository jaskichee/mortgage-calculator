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

export function StressTestChart({ data }: StressTestChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
          <YAxis unit="€" />
          <Tooltip formatter={(value: number) => `€${value.toFixed(0)}`} />
          <Legend />
          <Line type="monotone" dataKey="baseline" stroke="#0d9488" name="Baseline" strokeWidth={2} />
          <Line type="monotone" dataKey="rateIncrease" stroke="#eab308" name="Rate +2%" strokeWidth={2} />
          <Line type="monotone" dataKey="jobLoss" stroke="#ef4444" name="Job Loss" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
