import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DTIGaugeProps {
  value: number; // DTI percentage
  max?: number;
}

export function DTIGauge({ value, max = 60 }: DTIGaugeProps) {
  // Ensure value is within bounds
  const clampedValue = Math.min(Math.max(0, value), max);
  
  // Data for the gauge
  const data = [
    { name: 'Value', value: clampedValue },
    { name: 'Remaining', value: max - clampedValue },
  ];

  // Color based on value
  let color = '#0d9488'; // Secondary (Teal)
  if (value >= 30) color = '#eab308'; // Yellow
  if (value >= 40) color = '#ef4444'; // Red

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center">
      <div className="text-4xl font-bold text-foreground mb-2">
        {value.toFixed(1)}%
      </div>
      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell key="value" fill={color} />
              <Cell key="remaining" fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Limit: 40%
      </div>
    </div>
  );
}
