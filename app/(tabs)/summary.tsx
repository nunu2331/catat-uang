import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase } from '@/hooks/useDatabase';
import { useSummary } from '@/hooks/useSummary';
import { SummaryCard } from '@/components/SummaryCard';
import { formatRupiah } from '@/utils/currency';
import { monthName } from '@/utils/date';
import { colors, spacing, minTouchTargetSize } from '@/constants/theme';

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const { ready, error } = useDatabase();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const { summary, loading, refresh } = useSummary(year, month);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

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

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <View style={styles.pickerRow}>
        <Pressable
          style={styles.pickerButton}
          onPress={prevMonth}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Text style={styles.pickerLabel}>
          {monthName(month)} {year}
        </Text>
        <Pressable
          style={styles.pickerButton}
          onPress={nextMonth}
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={28} color={colors.text} />
        </Pressable>
      </View>

      {summary && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catering</Text>
            <SummaryCard
              title="Total Pemasukan"
              value={formatRupiah(summary.cateringIncome)}
              variant="income"
            />
            <SummaryCard
              title="Total Pengeluaran"
              value={formatRupiah(summary.cateringExpense)}
              variant="expense"
            />
            <SummaryCard
              title="Laba/Rugi"
              value={formatRupiah(summary.cateringProfit)}
              variant="profit"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pribadi</Text>
            <SummaryCard
              title="Total Pemasukan"
              value={formatRupiah(summary.pribadiIncome)}
              variant="income"
            />
            <SummaryCard
              title="Total Pengeluaran"
              value={formatRupiah(summary.pribadiExpense)}
              variant="expense"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Total Semua</Text>
            <SummaryCard
              title="Total Pemasukan"
              value={formatRupiah(summary.totalIncome)}
              variant="income"
            />
            <SummaryCard
              title="Total Pengeluaran"
              value={formatRupiah(summary.totalExpense)}
              variant="expense"
            />
            <SummaryCard
              title="Saldo Bersih"
              value={formatRupiah(summary.netBalance)}
              variant="profit"
            />
          </View>
        </>
      )}

      {!summary && !loading && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Tidak ada data untuk bulan ini.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 16, color: colors.textSecondary },
  error: { fontSize: 16, color: colors.expense },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTouchTargetSize,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  pickerButton: {
    minWidth: minTouchTargetSize,
    minHeight: minTouchTargetSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  empty: { padding: spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: 16, color: colors.textSecondary },
});
