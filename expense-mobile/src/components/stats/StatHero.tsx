import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export type StatPeriod =
  | '3M'
  | '6M'
  | '1Y';

interface StatHeroProps {
  period: StatPeriod;
  onPeriodChange: (
    value: StatPeriod
  ) => void;
}

export default function StatHero({
  period,
  onPeriodChange,
}: StatHeroProps) {
  return (
    <View style={styles.statHero}>
      <View style={styles.statHero__header}>
        <Text style={styles.statHero__title}>
          Thống kê & Báo cáo
        </Text>

        <Text style={styles.statHero__subtitle}>
          Tháng 10
        </Text>
      </View>

      <View style={styles.statHero__periods}>
        <TouchableOpacity
          style={[
            styles.statHero__period,
            period === '3M' &&
              styles.statHero__periodActive,
          ]}
          onPress={() => onPeriodChange('3M')}
        >
          <Text
            style={[
              styles.statHero__periodText,
              period === '3M' &&
                styles.statHero__periodTextActive,
            ]}
          >
            3 tháng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statHero__period,
            period === '6M' &&
              styles.statHero__periodActive,
          ]}
          onPress={() => onPeriodChange('6M')}
        >
          <Text
            style={[
              styles.statHero__periodText,
              period === '6M' &&
                styles.statHero__periodTextActive,
            ]}
          >
            6 tháng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statHero__period,
            period === '1Y' &&
              styles.statHero__periodActive,
          ]}
          onPress={() => onPeriodChange('1Y')}
        >
          <Text
            style={[
              styles.statHero__periodText,
              period === '1Y' &&
                styles.statHero__periodTextActive,
            ]}
          >
            1 năm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statHero: {
    gap: 16,
  },

  statHero__header: {
    gap: 4,
  },

  statHero__title: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  statHero__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    lineHeight: 20,
  },

  statHero__periods: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  statHero__period: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },

  statHero__periodActive: {
    backgroundColor: colors.primary,
  },

  statHero__periodText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  statHero__periodTextActive: {
    color: colors.textInverse,
    fontWeight: fonts.weight.semiBold,
  },
});