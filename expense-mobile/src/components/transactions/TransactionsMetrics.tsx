import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface TransactionsMetricsProps {
  income?: string | null;
  expense?: string | null;
  balance?: string | null;
}

export default function TransactionsMetrics({
  income,
  expense,
  balance,
}: TransactionsMetricsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.transactionsMetrics}
    >
      <View style={styles.transactionsMetrics__card}>
        <View style={styles.transactionsMetrics__header}>
          <Text style={styles.transactionsMetrics__label}>
            Tổng thu nhập
          </Text>

          <View style={styles.transactionsMetrics__icon}>
            <Feather
              name="trending-up"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>

        <Text
          style={[
            styles.transactionsMetrics__value,
            income
              ? styles.transactionsMetrics__valueIncome
              : styles.transactionsMetrics__valueEmpty,
          ]}
        >
          {income || 'Chưa có dữ liệu'}
        </Text>
      </View>

      <View style={styles.transactionsMetrics__card}>
        <View style={styles.transactionsMetrics__header}>
          <Text style={styles.transactionsMetrics__label}>
            Tổng chi tiêu
          </Text>

          <View style={styles.transactionsMetrics__icon}>
            <Feather
              name="trending-down"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>

        <Text
          style={[
            styles.transactionsMetrics__value,
            expense
              ? styles.transactionsMetrics__valueExpense
              : styles.transactionsMetrics__valueEmpty,
          ]}
        >
          {expense || 'Chưa có dữ liệu'}
        </Text>
      </View>

      <View style={styles.transactionsMetrics__card}>
        <View style={styles.transactionsMetrics__header}>
          <Text style={styles.transactionsMetrics__label}>
            Số dư ròng
          </Text>

          <View style={styles.transactionsMetrics__icon}>
            <Feather
              name="credit-card"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>

        <Text
          style={[
            styles.transactionsMetrics__value,
            !balance && styles.transactionsMetrics__valueEmpty,
          ]}
        >
          {balance || 'Chưa có dữ liệu'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  transactionsMetrics: {
    gap: 12,
  },

  transactionsMetrics__card: {
    width: 190,
    minHeight: 112,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  transactionsMetrics__header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  transactionsMetrics__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textMuted,
  },

  transactionsMetrics__icon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  transactionsMetrics__value: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  transactionsMetrics__valueIncome: {
    color: colors.income,
  },

  transactionsMetrics__valueExpense: {
    color: colors.expense,
  },

  transactionsMetrics__valueEmpty: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
});