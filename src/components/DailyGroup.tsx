import { View, Text, StyleSheet } from 'react-native';
import type { Transaction } from '@/models/transaction';
import { formatDisplayDate } from '@/utils/date';
import { formatRupiah } from '@/utils/currency';
import { TransactionItem } from './TransactionItem';
import { colors, spacing } from '@/constants/theme';

type DailyGroupProps = {
  date: string;
  transactions: Transaction[];
  dailyIncome: number;
  dailyExpense: number;
  onLongPressItem?: (id: number) => void;
};

export function DailyGroup({
  date,
  transactions,
  dailyIncome,
  dailyExpense,
  onLongPressItem,
}: DailyGroupProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDisplayDate(date)}</Text>
        <View style={styles.totals}>
          <Text style={styles.incomeText}>
            + {formatRupiah(dailyIncome)}
          </Text>
          <Text style={styles.expenseText}>
            - {formatRupiah(dailyExpense)}
          </Text>
        </View>
      </View>
      <View style={styles.list}>
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onLongPress={onLongPressItem}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totals: { flexDirection: 'row', gap: spacing.md },
  incomeText: { fontSize: 14, color: colors.income, fontWeight: '500' },
  expenseText: { fontSize: 14, color: colors.expense, fontWeight: '500' },
  list: {},
});
