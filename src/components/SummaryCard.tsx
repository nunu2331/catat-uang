import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type SummaryCardProps = {
  title: string;
  value: string;
  variant?: 'default' | 'income' | 'expense' | 'profit';
};

export function SummaryCard({ title, value, variant = 'default' }: SummaryCardProps) {
  const valueStyle =
    variant === 'income'
      ? styles.valueIncome
      : variant === 'expense'
        ? styles.valueExpense
        : variant === 'profit'
          ? styles.valueProfit
          : styles.value;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  valueIncome: { color: colors.income },
  valueExpense: { color: colors.expense },
  valueProfit: { color: colors.tabActive },
});
