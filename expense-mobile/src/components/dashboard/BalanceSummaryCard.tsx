import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface BalanceSummaryCardProps {
  balance?: string | null;
  income?: string | null;
  expense?: string | null;
}

export default function BalanceSummaryCard({
  balance,
  income,
  expense,
}: BalanceSummaryCardProps) {
  return (
    <View style={styles.balanceSummaryCard}>
      <View style={styles.balanceSummaryCard__header}>
        <Text style={styles.balanceSummaryCard__label}>
          Số dư tháng này
        </Text>

        <View style={styles.balanceSummaryCard__icon}>
          <Feather
            name="credit-card"
            size={16}
            color={colors.primary}
          />
        </View>
      </View>

      <Text
        style={[
          styles.balanceSummaryCard__balance,
          !balance &&
            styles.balanceSummaryCard__balanceEmpty,
        ]}
      >
        {balance || 'Chưa có dữ liệu'}
      </Text>

      <View style={styles.balanceSummaryCard__metrics}>
        <View style={styles.balanceSummaryCard__metric}>
          <View style={styles.balanceSummaryCard__metricHeader}>
            <View style={styles.balanceSummaryCard__metricIcon}>
              <Feather
                name="trending-up"
                size={15}
                color={colors.primary}
              />
            </View>

            <Text style={styles.balanceSummaryCard__metricLabel}>
              Tổng thu
            </Text>
          </View>

          <Text
            style={[
              styles.balanceSummaryCard__metricValue,
              {
                color: income
                  ? colors.income
                  : colors.textMuted,
              },
            ]}
          >
            {income || 'Chưa có dữ liệu'}
          </Text>
        </View>

        <View style={styles.balanceSummaryCard__divider} />

        <View style={styles.balanceSummaryCard__metric}>
          <View style={styles.balanceSummaryCard__metricHeader}>
            <View style={styles.balanceSummaryCard__metricIcon}>
              <Feather
                name="trending-down"
                size={15}
                color={colors.primary}
              />
            </View>

            <Text style={styles.balanceSummaryCard__metricLabel}>
              Tổng chi
            </Text>
          </View>

          <Text
            style={[
              styles.balanceSummaryCard__metricValue,
              {
                color: expense
                  ? colors.expense
                  : colors.textMuted,
              },
            ]}
          >
            {expense || 'Chưa có dữ liệu'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceSummaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 18,
    shadowColor: colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },

  balanceSummaryCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceSummaryCard__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.textInverse,
  },

  balanceSummaryCard__icon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },

  balanceSummaryCard__balance: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.textInverse,
    marginTop: 12,
    marginBottom: 20,
  },

  balanceSummaryCard__balanceEmpty: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.regular,
  },

  balanceSummaryCard__metrics: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
  },

  balanceSummaryCard__metric: {
    flex: 1,
  },

  balanceSummaryCard__metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  balanceSummaryCard__metricIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.focusRing,
  },

  balanceSummaryCard__metricLabel: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  balanceSummaryCard__metricValue: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
  },

  balanceSummaryCard__divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
});