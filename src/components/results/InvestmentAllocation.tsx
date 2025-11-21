import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InvestmentAllocationResult } from '@/lib/calculations/investment';

interface InvestmentAllocationProps {
  allocation: InvestmentAllocationResult;
}

export function InvestmentAllocation({ allocation }: InvestmentAllocationProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Investment Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!allocation.isEmergencyFundFunded ? (
            <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm">
              <h4 className="font-semibold text-primary mb-2">Priority: Build Emergency Fund</h4>
              <p className="text-sm text-muted-foreground mb-2">
                All surplus income is allocated to building your emergency fund.
              </p>
              <div className="flex justify-between items-center text-sm text-foreground">
                <span>Monthly Contribution:</span>
                <span className="font-bold">€{allocation.monthlyToEmergencyFund.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1 text-foreground">
                <span>Estimated Time to Goal:</span>
                <span className="font-bold">{allocation.monthsToEmergencyFundTarget} months</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm">
                <h4 className="font-semibold text-secondary mb-2">Emergency Fund Complete!</h4>
                <p className="text-sm text-muted-foreground">
                  You can now allocate surplus income to investments.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm text-center">
                  <div className="text-sm text-muted-foreground mb-1">ETFs (Growth)</div>
                  <div className="text-xl font-bold text-foreground">€{allocation.monthlyToETF.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground mt-1">/ month</div>
                </div>
                <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm text-center">
                  <div className="text-sm text-muted-foreground mb-1">Savings (Safe)</div>
                  <div className="text-xl font-bold text-foreground">€{allocation.monthlyToSavings.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground mt-1">/ month</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
