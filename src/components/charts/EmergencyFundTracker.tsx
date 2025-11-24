import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface EmergencyFundTrackerProps {
  currentSavings: number;
  targetAmount: number;
  monthlyContribution: number;
}

export function EmergencyFundTracker({ currentSavings, targetAmount, monthlyContribution }: EmergencyFundTrackerProps) {
  const t = useTranslations('Results.emergencyFund');
  const progress = Math.min(100, (currentSavings / targetAmount) * 100);
  const shortfall = Math.max(0, targetAmount - currentSavings);
  const monthsToGoal = monthlyContribution > 0 ? Math.ceil(shortfall / monthlyContribution) : Infinity;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-muted-foreground">{t('currentSavings')}</div>
          <div className="text-2xl font-bold text-foreground">€{currentSavings.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{t('targetGoal')}</div>
          <div className="text-2xl font-bold text-foreground">€{targetAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* 3D Animated Progress Bar */}
      <div className="w-full bg-secondary/30 rounded-full h-4 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-white/10 backdrop-blur-sm relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full relative overflow-hidden ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
          style={{
            boxShadow: '0 2px 5px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)'
          }}
        >
          {/* Top Highlight for 3D effect */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-70" />
          
          {/* Animated Shimmer */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
          />
        </motion.div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="text-muted-foreground">
          {progress.toFixed(1)}{t('funded')}
        </div>
        <div className="text-muted-foreground">
          {progress >= 100 
            ? t('goalReached') 
            : monthlyContribution > 0 
              ? t('monthsToGoal', { months: monthsToGoal }) 
              : t('noContribution')}
        </div>
      </div>
    </div>
  );
}
