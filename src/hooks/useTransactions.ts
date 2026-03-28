import { useCallback, useEffect, useState } from 'react';
import type { Transaction } from '@/models/transaction';
import * as repo from '@/db/transactionRepository';
import { today } from '@/utils/date';
import { monthRange } from '@/utils/date';

export type ListFilter = 'today' | 'month';

export function useTransactions(filter: ListFilter) {
  const [list, setList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (filter === 'today') {
        const items = await repo.getByDate(today());
        setList(items);
      } else {
        const { year, month } = getCurrentYearMonth();
        const { startDate, endDate } = monthRange(year, month);
        const items = await repo.getByDateRange(startDate, endDate);
        setList(items);
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const addTransaction = useCallback(
    async (tx: Omit<Transaction, 'id' | 'created_at'>) => {
      const id = await repo.insert(tx);
      await load();
      return id;
    },
    [load]
  );

  const removeTransaction = useCallback(
    async (id: number) => {
      await repo.deleteById(id);
      await load();
    },
    [load]
  );

  return { list, loading, refresh: load, addTransaction, removeTransaction };
}

function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
