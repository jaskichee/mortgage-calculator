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

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="€" />
          <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="Expenses" stackId="a" fill="#ef4444" />
          <Bar dataKey="Debts" stackId="a" fill="#f97316" />
          <Bar dataKey="Mortgage" stackId="a" fill="#eab308" />
          <Bar dataKey="Leftover" stackId="a" fill="#0d9488" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
