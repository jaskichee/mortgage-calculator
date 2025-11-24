import React from 'react';
import { useTranslations } from 'next-intl';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DTIGaugeProps {
  value: number; // DTI percentage
  max?: number;
}

export function DTIGauge({ value, max = 60 }: DTIGaugeProps) {
  const t = useTranslations('Results.charts.dtiGauge');
  // Ensure value is within bounds
  const clampedValue = Math.min(Math.max(0, value), max);
  
  // Data for the gauge
  const data = [
    { name: 'Value', value: clampedValue },
    { name: 'Remaining', value: max - clampedValue },
  ];

  // Color based on value
  let colorStart = '#2dd4bf'; // Teal-400
  let colorEnd = '#0f766e';   // Teal-700
  
  if (value >= 30) {
    colorStart = '#facc15'; // Yellow-400
    colorEnd = '#a16207';   // Yellow-700
  }
  if (value >= 40) {
    colorStart = '#f87171'; // Red-400
    colorEnd = '#b91c1c';   // Red-700
  }

  return (
    <div className="h-auto w-full flex flex-col items-center justify-center relative pt-6 pb-8 px-4">
      <div className="flex flex-col items-center justify-center z-10 relative top-6">
        <div className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 drop-shadow-sm">
          {value.toFixed(1)}%
        </div>
        <div className="text-sm font-medium text-muted-foreground mt-1 px-3 py-1 rounded-full bg-muted/50 border border-border backdrop-blur-md">
          {t('limit')}
        </div>
      </div>
      
      <div className="w-full h-48 min-h-[12rem] -mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={colorStart} />
                <stop offset="100%" stopColor={colorEnd} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius="85%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="value" fill="url(#gaugeGradient)" filter="url(#glow)" />
              <Cell key="remaining" fill="var(--secondary)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
