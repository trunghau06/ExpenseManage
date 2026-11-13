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

interface StatMetricsProps {
  income?: string | null;
  expense?: string | null;
  balance?: string | null;
}

export default function StatMetrics({
  income,
  expense,
  balance,
}: StatMetricsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.statMetrics}
    >
      <View style={styles.statMetrics__card}>
        <View style={styles.statMetrics__header}>
          <Text style={styles.statMetrics__label}>
            Tổng thu nhập
          </Text>

          <View style={styles.statMetrics__icon}>
            <Feather
              name="trending-up"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>

        <Text
          style={[
            styles.statMetrics__value,
            income
              ? styles.statMetrics__valueIncome
              : styles.statMetrics__valueEmpty,
          ]}
        >
          {income || 'Chưa có dữ liệu'}
        </Text>
      </View>

      <View style={styles.statMetrics__card}>
        <View style={styles.statMetrics__header}>
          <Text style={styles.statMetrics__label}>
            Tổng chi tiêu
          </Text>

          <View style={styles.statMetrics__icon}>
            <Feather
              name="trending-down"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>

        <Text
          style={[
            styles.statMetrics__value,
            expense
              ? styles.statMetrics__valueExpense
              : styles.statMetrics__valueEmpty,
          ]}
        >
          {expense || 'Chưa có dữ liệu'}
        </Text>
      </View>

      <View style={styles.statMetrics__card}>
        <View style={styles.statMetrics__header}>
          <Text style={styles.statMetrics__label}>
            Dòng tiền ròng
          </Text>

          <View style={styles.statMetrics__icon}>
            <Feather
              name="credit-card"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>

        <Text
          style={[
            styles.statMetrics__value,
            !balance &&
              styles.statMetrics__valueEmpty,
          ]}
        >
          {balance || 'Chưa có dữ liệu'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statMetrics: {
    gap: 12,
  },

  statMetrics__card: {
    width: 190,
    minHeight: 112,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  statMetrics__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  statMetrics__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textMuted,
  },

  statMetrics__icon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },

  statMetrics__value: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  statMetrics__valueIncome: {
    color: colors.income,
  },

  statMetrics__valueExpense: {
    color: colors.expense,
  },

  statMetrics__valueEmpty: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
});