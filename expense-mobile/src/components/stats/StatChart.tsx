import React from 'react';
import {
  ScrollView,
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

const CHART_HEIGHT = 180;
const COLUMN_WIDTH = 22;

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
    0,
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statChart__scrollContent}
      >
        <View style={styles.statChart__chart}>
          {items.map((item) => {
            const incomeHeight = maxValue > 0
              ? (Math.max(0, item.income) / maxValue) * CHART_HEIGHT
              : 0;
            const expenseHeight = maxValue > 0
              ? (Math.max(0, item.expense) / maxValue) * CHART_HEIGHT
              : 0;

            return (
              <View
                key={item.id}
                style={styles.statChart__item}
              >
                <View style={styles.statChart__barGroup}>
                  <View
                    style={[
                      styles.statChart__incomeBar,
                      {
                        height: incomeHeight,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.statChart__expenseBar,
                      {
                        height: expenseHeight,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={styles.statChart__label}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  statChart__scrollContent: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  statChart__chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 18,
    minHeight: CHART_HEIGHT + 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statChart__item: {
    width: 72,
    alignItems: 'center',
  },
  statChart__barGroup: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 5,
  },
  statChart__incomeBar: {
    width: COLUMN_WIDTH,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.income,
  },
  statChart__expenseBar: {
    width: COLUMN_WIDTH,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.expense,
  },
  statChart__label: {
    height: 28,
    marginTop: 8,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
