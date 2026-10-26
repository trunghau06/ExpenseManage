
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface BalanceSummaryCardProps {
  balance?: string | null;
  income?: string | null;
  expense?: string | null;
  period?: 'current' | 'previous';
  budgetPercent?: number | null;
}


export default function BalanceSummaryCard({
  balance,
  income,
  expense,
  period = 'current',
  budgetPercent,
}: BalanceSummaryCardProps) {
  const now = new Date();
  const selectedMonth =
    period === 'current'
      ? now.getMonth() + 1
      : new Date(now.getFullYear(), now.getMonth() - 1, 1).getMonth() + 1;

const periodLabel = `Số dư tháng ${selectedMonth}`;

  const usedPercent =
    typeof budgetPercent === 'number' &&
    Number.isFinite(budgetPercent)
      ? Math.max(0, Math.min(100, budgetPercent))
      : null;

  return (
    <LinearGradient
      colors={colors.balanceGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceSummaryCard}
    >
      <View style={styles.balanceSummaryCard__header}>
        <View style={styles.balanceSummaryCard__labelBox}>
          <View style={styles.balanceSummaryCard__dot} />

          <Text style={styles.balanceSummaryCard__label}>
            {periodLabel}
          </Text>
        </View>

        <View style={styles.balanceSummaryCard__icon}>
          <Feather
            name="credit-card"
            size={20}
            color={colors.textInverse}
          />
        </View>
      </View>

      <Text
        style={[
          styles.balanceSummaryCard__balance,
          !balance && styles.balanceSummaryCard__balanceEmpty,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {balance || 'Chưa có dữ liệu'}
      </Text>

      <View style={styles.balanceSummaryCard__metrics}>
        <View style={styles.balanceSummaryCard__metric}>
          <View style={styles.balanceSummaryCard__metricHeader}>
            <View style={styles.balanceSummaryCard__metricIcon}>
              <Feather
                name="arrow-up-right"
                size={20}
                color={colors.income}
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
                  : colors.textInverse,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {income ? `+${income}` : 'Chưa có dữ liệu'}
          </Text>
        </View>

        <View style={styles.balanceSummaryCard__metric}>
          <View style={styles.balanceSummaryCard__metricHeader}>
            <View style={styles.balanceSummaryCard__metricIcon}>
              <Feather
                name="arrow-down-right"
                size={20}
                color={colors.textInverse}
              />
            </View>

            <Text style={styles.balanceSummaryCard__metricLabel}>
              Tổng chi
            </Text>
          </View>

          <Text
            style={[
              styles.balanceSummaryCard__metricValue,
              styles.balanceSummaryCard__expenseValue,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {expense ? `-${expense}` : 'Chưa có dữ liệu'}
          </Text>
        </View>
      </View>

      <View style={styles.balanceSummaryCard__budget}>
        <View style={styles.balanceSummaryCard__budgetHeader}>
          <Text style={styles.balanceSummaryCard__budgetLabel}>
            Đã chi tiêu ngân sách
          </Text>

          <Text style={styles.balanceSummaryCard__budgetPercent}>
            {usedPercent !== null
              ? `${Math.round(usedPercent)}% / 100%`
              : 'Chưa có dữ liệu'}
          </Text>
        </View>

        <View style={styles.balanceSummaryCard__progressTrack}>
          <View
            style={[
              styles.balanceSummaryCard__progressFill,
              {
                width: `${usedPercent ?? 0}%` as `${number}%`,
              },
            ]}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  balanceSummaryCard: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },

  balanceSummaryCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  balanceSummaryCard__labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.focusRing,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  balanceSummaryCard__dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.income,
  },

  balanceSummaryCard__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },

  balanceSummaryCard__icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.focusRing,
  },

  balanceSummaryCard__balance: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.textInverse,
    marginTop: 4,
  },

  balanceSummaryCard__balanceEmpty: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.regular,
  },

  balanceSummaryCard__metrics: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  balanceSummaryCard__metric: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    backgroundColor: colors.focusRing,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },

  balanceSummaryCard__metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  balanceSummaryCard__metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.focusRing,
  },

  balanceSummaryCard__metricLabel: {
    flexShrink: 1,
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },

  balanceSummaryCard__metricValue: {
    width: '100%',
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
  },

  balanceSummaryCard__expenseValue: {
    color: colors.textInverse,
  },

  balanceSummaryCard__budget: {
    marginTop: 20,
    gap: 8,
  },

  balanceSummaryCard__budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  balanceSummaryCard__budgetLabel: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textInverse,
  },

  balanceSummaryCard__budgetPercent: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },

  balanceSummaryCard__progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.focusRing,
    overflow: 'hidden',
  },

  balanceSummaryCard__progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.income,
  },
});
