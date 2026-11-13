import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export type TransactionFilterType =
  | 'ALL'
  | 'INCOME'
  | 'EXPENSE';

interface TransactionsFilterProps {
  search: string;
  type: TransactionFilterType;
  periodLabel?: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TransactionFilterType) => void;
  onPeriodPress?: () => void;
}

export default function TransactionsFilter({
  search,
  type,
  periodLabel = 'Tháng này',
  onSearchChange,
  onTypeChange,
  onPeriodPress,
}: TransactionsFilterProps) {
  return (
    <View style={styles.transactionsFilter}>
      <View style={styles.transactionsFilter__search}>
        <Feather
          name="search"
          size={18}
          color={colors.textMuted}
        />

        <TextInput
          style={styles.transactionsFilter__input}
          value={search}
          onChangeText={onSearchChange}
          placeholder="Tìm kiếm giao dịch..."
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.transactionsFilter__row}>
        <View style={styles.transactionsFilter__types}>
          <TouchableOpacity
            style={[
              styles.transactionsFilter__type,
              type === 'ALL' &&
                styles.transactionsFilter__typeActive,
            ]}
            onPress={() => onTypeChange('ALL')}
          >
            <Text
              style={[
                styles.transactionsFilter__typeText,
                type === 'ALL' &&
                  styles.transactionsFilter__typeTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.transactionsFilter__type,
              type === 'INCOME' &&
                styles.transactionsFilter__typeActive,
            ]}
            onPress={() => onTypeChange('INCOME')}
          >
            <Text
              style={[
                styles.transactionsFilter__typeText,
                type === 'INCOME' &&
                  styles.transactionsFilter__typeTextActive,
              ]}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.transactionsFilter__type,
              type === 'EXPENSE' &&
                styles.transactionsFilter__typeActive,
            ]}
            onPress={() => onTypeChange('EXPENSE')}
          >
            <Text
              style={[
                styles.transactionsFilter__typeText,
                type === 'EXPENSE' &&
                  styles.transactionsFilter__typeTextActive,
              ]}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.transactionsFilter__period}
          onPress={onPeriodPress}
        >
          <Feather
            name="calendar"
            size={16}
            color={colors.primary}
          />

          <Text style={styles.transactionsFilter__periodText}>
            {periodLabel}
          </Text>

          <Feather
            name="chevron-down"
            size={15}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsFilter: {
    gap: 12,
  },

  transactionsFilter__search: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  transactionsFilter__input: {
    flex: 1,
    padding: 0,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.text,
  },

  transactionsFilter__row: {
    gap: 10,
  },

  transactionsFilter__types: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  transactionsFilter__type: {
    flex: 1,
    minHeight: 36,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  transactionsFilter__typeActive: {
    backgroundColor: colors.primary,
  },

  transactionsFilter__typeText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  transactionsFilter__typeTextActive: {
    color: colors.textInverse,
  },

  transactionsFilter__period: {
    height: 42,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  transactionsFilter__periodText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.text,
  },
});