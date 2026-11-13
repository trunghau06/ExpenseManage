import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export type DashboardPeriod =
  | 'current'
  | 'previous';

interface PeriodTabsProps {
  value: DashboardPeriod;
  onChange: (
    value: DashboardPeriod
  ) => void;
}

export default function PeriodTabs({
  value,
  onChange,
}: PeriodTabsProps) {
  return (
    <View style={styles.periodTabs}>
      <TouchableOpacity
        style={[
          styles.periodTabs__item,
          value === 'current' &&
            styles.periodTabs__itemActive,
        ]}
        onPress={() => onChange('current')}
      >
        <Text
          style={[
            styles.periodTabs__text,
            value === 'current' &&
              styles.periodTabs__textActive,
          ]}
        >
          Tháng này
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.periodTabs__item,
          value === 'previous' &&
            styles.periodTabs__itemActive,
        ]}
        onPress={() => onChange('previous')}
      >
        <Text
          style={[
            styles.periodTabs__text,
            value === 'previous' &&
              styles.periodTabs__textActive,
          ]}
        >
          Tháng trước
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  periodTabs__item: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  periodTabs__itemActive: {
    backgroundColor: colors.primary,
  },

  periodTabs__text: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  periodTabs__textActive: {
    color: colors.textInverse,
    fontWeight: fonts.weight.semiBold,
  },
});