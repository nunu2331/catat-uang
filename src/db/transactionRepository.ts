import type { Transaction, MonthlySummary } from '@/models/transaction';
import { getDatabase } from './database';

function rowToTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as number,
    date: row.date as string,
    type: row.type as Transaction['type'],
    category: row.category as Transaction['category'],
    description: row.description as string,
    amount: row.amount as number,
    created_at: row.created_at as string,
  };
}

export async function insert(
  tx: Omit<Transaction, 'id' | 'created_at'>
): Promise<number> {
  const db = getDatabase();
  if (!db) throw new Error('Database not initialized');
  const result = await db.runAsync(
    `INSERT INTO transactions (date, type, category, description, amount)
     VALUES (?, ?, ?, ?, ?)`,
    [tx.date, tx.type, tx.category, tx.description, tx.amount]
  );
  return result.lastInsertRowId;
}

export async function getByDateRange(
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  const db = getDatabase();
  if (!db) throw new Error('Database not initialized');
  const result = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM transactions WHERE date >= ? AND date <= ? ORDER BY date DESC, id DESC`,
    [startDate, endDate]
  );
  return result.map(rowToTransaction);
}

export async function getByDate(date: string): Promise<Transaction[]> {
  const db = getDatabase();
  if (!db) throw new Error('Database not initialized');
  const result = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM transactions WHERE date = ? ORDER BY id DESC`,
    [date]
  );
  return result.map(rowToTransaction);
}

export async function deleteById(id: number): Promise<void> {
  const db = getDatabase();
  if (!db) throw new Error('Database not initialized');
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
}

export async function getMonthlySummary(
  year: number,
  month: number
): Promise<MonthlySummary> {
  const db = getDatabase();
  if (!db) throw new Error('Database not initialized');
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT type, category, SUM(amount) as total
     FROM transactions
     WHERE date >= ? AND date <= ?
     GROUP BY type, category`,
    [startDate, endDate]
  );

  let cateringIncome = 0;
  let cateringExpense = 0;
  let pribadiIncome = 0;
  let pribadiExpense = 0;

  for (const row of rows) {
    const total = (row.total as number) ?? 0;
    const type = row.type as string;
    const category = row.category as string;
    if (category === 'catering') {
      if (type === 'income') cateringIncome += total;
      else cateringExpense += total;
    } else {
      if (type === 'income') pribadiIncome += total;
      else pribadiExpense += total;
    }
  }

  const totalIncome = cateringIncome + pribadiIncome;
  const totalExpense = cateringExpense + pribadiExpense;

  return {
    cateringIncome,
    cateringExpense,
    cateringProfit: cateringIncome - cateringExpense,
    pribadiIncome,
    pribadiExpense,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
}
