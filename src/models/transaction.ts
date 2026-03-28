export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'catering' | 'pribadi';

export interface Transaction {
  id: number;
  date: string; // 'YYYY-MM-DD'
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number; // Rupiah
  created_at: string;
}

export interface MonthlySummary {
  cateringIncome: number;
  cateringExpense: number;
  cateringProfit: number;
  pribadiIncome: number;
  pribadiExpense: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}
