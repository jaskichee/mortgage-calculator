import { IncomeFormData } from '@/lib/schemas/income-schema';
import { ExpensesFormData } from '@/lib/schemas/expenses-schema';
import { MortgageFormData } from '@/lib/schemas/mortgage-schema';
import { ChildrenFormData } from '@/lib/schemas/children-schema';
import { DebtsFormData } from '@/lib/schemas/debts-schema';
import { InvestmentFormData } from '@/lib/schemas/investment-schema';

export interface CalculatorData {
  income: IncomeFormData;
  expenses: ExpensesFormData;
  mortgage: MortgageFormData;
  children: ChildrenFormData;
  debts: DebtsFormData;
  investment: InvestmentFormData;
}

export type CalculatorStep = 
  | 'income'
  | 'expenses'
  | 'mortgage'
  | 'children'
  | 'debts'
  | 'investment';
