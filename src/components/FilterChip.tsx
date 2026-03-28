import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, minTouchTargetSize } from '@/constants/theme';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: minTouchTargetSize,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipSelected: {
    backgroundColor: colors.tabActive,
    borderColor: colors.tabActive,
  },
  label: {
    fontSize: 16,
    color: colors.text,
  },
  labelSelected: {
    color: colors.background,
    fontWeight: '600',
  },
});
