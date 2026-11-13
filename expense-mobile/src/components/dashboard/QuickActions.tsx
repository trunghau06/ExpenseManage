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

interface QuickActionsProps {
  onTransactionsPress: () => void;
  onBudgetPress: () => void;
  onStatPress: () => void;
  onGoalPress: () => void;
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
    id: 'stat',
    label: 'Báo cáo',
    icon: 'bar-chart-2',
  },
  {
    id: 'goal',
    label: 'Mục tiêu',
    icon: 'target',
  },
];

export default function QuickActions(
  { 
    onTransactionsPress,
    onBudgetPress,
    onStatPress,
    onGoalPress,
  } : QuickActionsProps) {
  return (
    <View style={styles.quickActions}>
      {actions.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.quickActions__item}
          activeOpacity={0.8}
          onPress={
            item.id === 'transaction'
              ? onTransactionsPress
              : item.id === 'budget'
                ? onBudgetPress
                : item.id === 'stat'
                  ? onStatPress
                  : item.id === 'goal'
                    ? onGoalPress
                    : undefined
          }
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
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.medium,
    color: colors.text,
    textAlign: 'center',
  },
});