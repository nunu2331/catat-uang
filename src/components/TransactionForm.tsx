import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import type { TransactionType, TransactionCategory } from '@/models/transaction';
import { formatRupiah, parseRupiahInput } from '@/utils/currency';
import { toDateString } from '@/utils/date';
import { colors, spacing, minTouchTargetSize } from '@/constants/theme';

export type TransactionFormValues = {
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
};

type TransactionFormProps = {
  initialDate?: string;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  onSuccess?: () => void;
};

export function TransactionForm({
  initialDate,
  onSubmit,
  onSuccess,
}: TransactionFormProps) {
  const [date, setDate] = useState(initialDate ?? toDateString(new Date()));
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('catering');
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [saving, setSaving] = useState(false);

  const amount = parseRupiahInput(amountInput);

  const handleSubmit = async () => {
    const trimmed = description.trim();
    if (!trimmed) {
      Alert.alert('Perhatian', 'Deskripsi wajib diisi.');
      return;
    }
    if (amount <= 0) {
      Alert.alert('Perhatian', 'Jumlah harus lebih dari 0.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        date,
        type,
        category,
        description: trimmed,
        amount,
      });
      setDescription('');
      setAmountInput('');
      onSuccess?.();
    } catch (e) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const typeOptions: { value: TransactionType; label: string }[] = [
    { value: 'income', label: 'Pemasukan' },
    { value: 'expense', label: 'Pengeluaran' },
  ];
  const categoryOptions: { value: TransactionCategory; label: string }[] = [
    { value: 'catering', label: 'Catering' },
    { value: 'pribadi', label: 'Pribadi' },
  ];

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Tanggal</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        editable={Platform.OS === 'web'}
      />

      <Text style={styles.label}>Tipe</Text>
      <View style={styles.row}>
        {typeOptions.map((opt) => (
          <Pressable
            key={opt.value}
            style={[styles.toggle, type === opt.value && styles.toggleSelected]}
            onPress={() => setType(opt.value)}
          >
            <Text
              style={[
                styles.toggleText,
                type === opt.value && styles.toggleTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.row}>
        {categoryOptions.map((opt) => (
          <Pressable
            key={opt.value}
            style={[styles.toggle, category === opt.value && styles.toggleSelected]}
            onPress={() => setCategory(opt.value)}
          >
            <Text
              style={[
                styles.toggleText,
                category === opt.value && styles.toggleTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Contoh: Bayar bahan baku"
        autoCapitalize="sentences"
      />

      <Text style={styles.label}>Jumlah (Rp)</Text>
      <TextInput
        style={styles.input}
        value={amountInput}
        onChangeText={(t) => setAmountInput(t.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
        placeholder="0"
        keyboardType="numeric"
      />
      {amount > 0 && (
        <Text style={styles.preview}>{formatRupiah(amount)}</Text>
      )}

      <Pressable
        style={[styles.submit, saving && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.submitText}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    minHeight: minTouchTargetSize,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  toggle: {
    flex: 1,
    minHeight: minTouchTargetSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  toggleSelected: {
    backgroundColor: colors.tabActive,
    borderColor: colors.tabActive,
  },
  toggleText: { fontSize: 16, color: colors.text },
  toggleTextSelected: { color: colors.background, fontWeight: '600' },
  preview: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textSecondary,
  },
  submit: {
    minHeight: minTouchTargetSize,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tabActive,
    borderRadius: 8,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.background,
  },
});
