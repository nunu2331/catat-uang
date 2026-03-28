import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Transaction } from '@/models/transaction';
import { formatRupiah } from '@/utils/currency';
import { colors, spacing, minTouchTargetSize } from '@/constants/theme';

type TransactionItemProps = {
  transaction: Transaction;
  onLongPress?: (id: number) => void;
};

export function TransactionItem({ transaction, onLongPress }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const categoryLabel = transaction.category === 'catering' ? 'Catering' : 'Pribadi';

  return (
    <Pressable
      style={styles.row}
      onLongPress={() => onLongPress?.(transaction.id)}
      delayLongPress={400}
    >
      <View style={styles.left}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{categoryLabel}</Text>
        </View>
      </View>
      <Text style={[styles.amount, isIncome ? styles.amountIncome : styles.amountExpense]}>
        {isIncome ? '+' : '-'} {formatRupiah(transaction.amount)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTouchTargetSize,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: { flex: 1, marginRight: spacing.sm },
  description: {
    fontSize: 16,
    color: colors.text,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  badgeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountIncome: { color: colors.income },
  amountExpense: { color: colors.expense },
});
