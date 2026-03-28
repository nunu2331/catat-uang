import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDatabase } from '@/hooks/useDatabase';
import { useTransactions, type ListFilter } from '@/hooks/useTransactions';
import { FilterChip } from '@/components/FilterChip';
import { DailyGroup } from '@/components/DailyGroup';
import type { Transaction } from '@/models/transaction';
import { colors, spacing } from '@/constants/theme';

type GroupedByDate = { date: string; transactions: Transaction[]; income: number; expense: number };

function groupByDate(list: Transaction[]): GroupedByDate[] {
  const map = new Map<string, { transactions: Transaction[]; income: number; expense: number }>();
  for (const tx of list) {
    let entry = map.get(tx.date);
    if (!entry) {
      entry = { transactions: [], income: 0, expense: 0 };
      map.set(tx.date, entry);
    }
    entry.transactions.push(tx);
    if (tx.type === 'income') entry.income += tx.amount;
    else entry.expense += tx.amount;
  }
  const sorted = Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, { transactions, income, expense }]) => ({
      date,
      transactions,
      income,
      expense,
    }));
  return sorted;
}

export default function TransactionListScreen() {
  const insets = useSafeAreaInsets();
  const { ready, error } = useDatabase();
  const [filter, setFilter] = useState<ListFilter>('today');
  const { list, loading, refresh, removeTransaction } = useTransactions(filter);

  const onLongPressItem = useCallback((id: number) => {
    Alert.alert(
      'Hapus transaksi',
      'Yakin ingin menghapus transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => removeTransaction(id) },
      ]
    );
  }, [removeTransaction]);

  if (!ready) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.message}>Memuat...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.error}>Error: {error.message}</Text>
      </View>
    );
  }

  const grouped = groupByDate(list);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.filterRow}>
        <FilterChip
          label="Hari Ini"
          selected={filter === 'today'}
          onPress={() => setFilter('today')}
        />
        <FilterChip
          label="Bulan Ini"
          selected={filter === 'month'}
          onPress={() => setFilter('month')}
        />
      </View>
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <DailyGroup
            date={item.date}
            transactions={item.transactions}
            dailyIncome={item.income}
            dailyExpense={item.expense}
            onLongPressItem={onLongPressItem}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {filter === 'today' ? 'Tidak ada transaksi hari ini.' : 'Tidak ada transaksi bulan ini.'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 16, color: colors.textSecondary },
  error: { fontSize: 16, color: colors.expense },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: { paddingBottom: spacing.xl },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: colors.textSecondary },
});
