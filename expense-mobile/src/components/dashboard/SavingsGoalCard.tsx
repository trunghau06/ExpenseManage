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

interface SavingsGoalCardProps {
  name?: string | null;
  current?: string | null;
  target?: string | null;
  progress?: number | null;
}

export default function SavingsGoalCard({
  name,
  current,
  target,
  progress,
}: SavingsGoalCardProps) {
  if (
    !name ||
    !current ||
    !target ||
    progress == null
  ) {
    return (
      <SectionCard
        title="Mục tiêu tiết kiệm"
        rightText="Xem tất cả"
      >
        <EmptyState />
      </SectionCard>
    );
  }

  const safeProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  const progressWidth =
    `${safeProgress}%` as `${number}%`;

  return (
    <SectionCard
      title="Mục tiêu tiết kiệm"
      rightText="Xem tất cả"
    >
      <View style={styles.savingsGoalCard__header}>
        <Text style={styles.savingsGoalCard__name}>
          {name}
        </Text>

        <Text style={styles.savingsGoalCard__percent}>
          {safeProgress}%
        </Text>
      </View>

      <View style={styles.savingsGoalCard__values}>
        <Text style={styles.savingsGoalCard__current}>
          {current}
        </Text>

        <Text style={styles.savingsGoalCard__target}>
          / {target}
        </Text>
      </View>

      <View style={styles.savingsGoalCard__track}>
        <View
          style={[
            styles.savingsGoalCard__progress,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  savingsGoalCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  savingsGoalCard__name: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  savingsGoalCard__percent: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  savingsGoalCard__values: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  savingsGoalCard__current: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  savingsGoalCard__target: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    marginLeft: 4,
  },

  savingsGoalCard__track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  savingsGoalCard__progress: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});