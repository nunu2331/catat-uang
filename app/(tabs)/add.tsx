import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDatabase } from '@/hooks/useDatabase';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionForm } from '@/components/TransactionForm';
import { today } from '@/utils/date';
import { colors, spacing } from '@/constants/theme';

export default function AddTransactionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ready, error } = useDatabase();
  const { addTransaction } = useTransactions('month');

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TransactionForm
        initialDate={today()}
        onSubmit={async (values) => {
          await addTransaction(values);
        }}
        onSuccess={() => router.replace('/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 16, color: colors.textSecondary },
  error: { fontSize: 16, color: colors.expense },
});
