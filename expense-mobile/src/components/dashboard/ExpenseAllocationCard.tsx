import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import EmptyState from '../ui/EmptyState';
import SectionCard from '../ui/SectionCard';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface ExpenseItem {
  id: string;
  name: string;
  amount: string;
  percent: number;
}

interface ExpenseAllocationCardProps {
  items?: ExpenseItem[];
  total?: string | null;
  periodLabel?: string;
}

export default function ExpenseAllocationCard({
  items = [],
  total,
  periodLabel = 'Tháng này',
}: ExpenseAllocationCardProps) {
  if (items.length === 0) {
    return (
      <SectionCard
        title="Cơ cấu chi tiêu"
        rightText={periodLabel}
      >
        <EmptyState />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Cơ cấu chi tiêu"
      rightText={periodLabel}
    >
      <View style={styles.expenseAllocationCard__chart}>
        <View style={styles.expenseAllocationCard__circle}>
          <Text style={styles.expenseAllocationCard__chartLabel}>
            Tổng chi
          </Text>

          <Text style={styles.expenseAllocationCard__chartValue}>
            {total || 'Chưa có dữ liệu'}
          </Text>
        </View>
      </View>

      <View style={styles.expenseAllocationCard__list}>
        {items.map((item) => (
          <View
            key={item.id}
            style={styles.expenseAllocationCard__item}
          >
            <View style={styles.expenseAllocationCard__left}>
              <View style={styles.expenseAllocationCard__dot} />

              <Text style={styles.expenseAllocationCard__name}>
                {item.name}
              </Text>
            </View>

            <View style={styles.expenseAllocationCard__right}>
              <Text style={styles.expenseAllocationCard__amount}>
                {item.amount}
              </Text>

              <Text style={styles.expenseAllocationCard__percent}>
                {item.percent}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  expenseAllocationCard__chart: {
    alignItems: 'center',
    marginBottom: 20,
  },

  expenseAllocationCard__circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 16,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  expenseAllocationCard__chartLabel: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    marginBottom: 4,
  },

  expenseAllocationCard__chartValue: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  expenseAllocationCard__list: {
    gap: 12,
  },

  expenseAllocationCard__item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expenseAllocationCard__left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  expenseAllocationCard__dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  expenseAllocationCard__name: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.text,
  },

  expenseAllocationCard__right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  expenseAllocationCard__amount: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  expenseAllocationCard__percent: {
    width: 34,
    textAlign: 'right',
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },
});