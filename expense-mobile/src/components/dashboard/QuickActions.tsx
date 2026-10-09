import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface ActionItem {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

const actions: ActionItem[] = [
  {
    id: 'transaction',
    label: 'Giao dịch',
    icon: 'plus-circle',
  },
  {
    id: 'budget',
    label: 'Ngân sách',
    icon: 'credit-card',
  },
  {
    id: 'report',
    label: 'Báo cáo',
    icon: 'bar-chart-2',
  },
  {
    id: 'saving',
    label: 'Mục tiêu',
    icon: 'target',
  },
];

export default function QuickActions() {
  return (
    <View style={styles.quickActions}>
      {actions.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.quickActions__item}
          activeOpacity={0.8}
        >
          <View style={styles.quickActions__icon}>
            <Feather
              name={item.icon}
              size={18}
              color={colors.primary}
            />
          </View>

          <Text style={styles.quickActions__label}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  quickActions__item: {
    flex: 1,
    alignItems: 'center',
  },

  quickActions__icon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 7,
  },

  quickActions__label: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.text,
    textAlign: 'center',
  },
});