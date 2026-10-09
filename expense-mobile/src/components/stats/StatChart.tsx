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

export interface StatChartItem {
  id: string;
  label: string;
  income: number;
  expense: number;
}

interface StatChartProps {
  items?: StatChartItem[];
}

export default function StatChart({
  items = [],
}: StatChartProps) {
  if (items.length === 0) {
    return (
      <SectionCard title="Thu chi theo thời gian">
        <EmptyState />
      </SectionCard>
    );
  }

  const maxValue = Math.max(
    ...items.flatMap((item) => [
      item.income,
      item.expense,
    ])
  );

  return (
    <SectionCard title="Thu chi theo thời gian">
      <View style={styles.statChart__legend}>
        <View style={styles.statChart__legendItem}>
          <View style={styles.statChart__incomeDot} />

          <Text style={styles.statChart__legendText}>
            Thu nhập
          </Text>
        </View>

        <View style={styles.statChart__legendItem}>
          <View style={styles.statChart__expenseDot} />

          <Text style={styles.statChart__legendText}>
            Chi tiêu
          </Text>
        </View>
      </View>

      <View style={styles.statChart__content}>
        {items.map((item) => {
          const incomePercent =
            maxValue > 0
              ? (item.income / maxValue) * 100
              : 0;

          const expensePercent =
            maxValue > 0
              ? (item.expense / maxValue) * 100
              : 0;

          const incomeWidth =
            `${incomePercent}%` as `${number}%`;

          const expenseWidth =
            `${expensePercent}%` as `${number}%`;

          return (
            <View
              key={item.id}
              style={styles.statChart__item}
            >
              <Text style={styles.statChart__label}>
                {item.label}
              </Text>

              <View style={styles.statChart__bars}>
                <View style={styles.statChart__track}>
                  <View
                    style={[
                      styles.statChart__incomeBar,
                      {
                        width: incomeWidth,
                      },
                    ]}
                  />
                </View>

                <View style={styles.statChart__track}>
                  <View
                    style={[
                      styles.statChart__expenseBar,
                      {
                        width: expenseWidth,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  statChart__legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 20,
  },

  statChart__legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statChart__incomeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.income,
  },

  statChart__expenseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.expense,
  },

  statChart__legendText: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  statChart__content: {
    gap: 16,
  },

  statChart__item: {
    gap: 8,
  },

  statChart__label: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.text,
  },

  statChart__bars: {
    gap: 5,
  },

  statChart__track: {
    width: '100%',
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  statChart__incomeBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.income,
  },

  statChart__expenseBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.expense,
  },
});