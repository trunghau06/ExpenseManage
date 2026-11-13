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

export interface TopExpenseItem {
  id: string;
  name: string;
  amount: string;
  percent: number;
}

interface TopExpensesCardProps {
  items?: TopExpenseItem[];
}

export default function TopExpensesCard({
  items = [],
}: TopExpensesCardProps) {
  if (items.length === 0) {
    return (
      <SectionCard title="Chi tiêu hàng đầu">
        <EmptyState />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Chi tiêu hàng đầu">
      <View style={styles.topExpensesCard__list}>
        {items.map((item, index) => {
          const progress =
            Math.min(
              Math.max(item.percent, 0),
              100
            );

          const progressWidth =
            `${progress}%` as `${number}%`;

          return (
            <View
              key={item.id}
              style={styles.topExpensesCard__item}
            >
              <View style={styles.topExpensesCard__header}>
                <View style={styles.topExpensesCard__left}>
                  <View style={styles.topExpensesCard__rank}>
                    <Text style={styles.topExpensesCard__rankText}>
                      {index + 1}
                    </Text>
                  </View>

                  <Text style={styles.topExpensesCard__name}>
                    {item.name}
                  </Text>
                </View>

                <Text style={styles.topExpensesCard__amount}>
                  {item.amount}
                </Text>
              </View>

              <View style={styles.topExpensesCard__bottom}>
                <View style={styles.topExpensesCard__track}>
                  <View
                    style={[
                      styles.topExpensesCard__progress,
                      {
                        width: progressWidth,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.topExpensesCard__percent}>
                  {progress}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  topExpensesCard__list: {
    gap: 18,
  },

  topExpensesCard__item: {
    gap: 10,
  },

  topExpensesCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  topExpensesCard__left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  topExpensesCard__rank: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },

  topExpensesCard__rankText: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },

  topExpensesCard__name: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  topExpensesCard__amount: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
    color: colors.expense,
  },

  topExpensesCard__bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  topExpensesCard__track: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  topExpensesCard__progress: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  topExpensesCard__percent: {
    width: 36,
    textAlign: 'right',
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },
});