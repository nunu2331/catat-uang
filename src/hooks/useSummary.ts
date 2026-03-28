import { useCallback, useEffect, useState } from 'react';
import type { MonthlySummary } from '@/models/transaction';
import { getMonthlySummary } from '@/db/transactionRepository';

export function useSummary(year: number, month: number) {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMonthlySummary(year, month);
      setSummary(data);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  return { summary, loading, refresh: load };
}
