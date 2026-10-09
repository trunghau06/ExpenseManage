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

interface BudgetSummaryCardProps {
  name?: string | null;
  spent?: string | null;
  limit?: string | null;
  progress?: number | null;
}

export default function BudgetSummaryCard({
  name,
  spent,
  limit,
  progress,
}: BudgetSummaryCardProps) {
  if (
    !name ||
    !spent ||
    !limit ||
    progress == null
  ) {
    return (
      <SectionCard
        title="Ngân sách"
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
      title="Ngân sách"
      rightText="Xem tất cả"
    >
      <View style={styles.budgetSummaryCard__header}>
        <Text style={styles.budgetSummaryCard__name}>
          {name}
        </Text>

        <Text style={styles.budgetSummaryCard__percent}>
          {safeProgress}%
        </Text>
      </View>

      <View style={styles.budgetSummaryCard__values}>
        <Text style={styles.budgetSummaryCard__spent}>
          {spent}
        </Text>

        <Text style={styles.budgetSummaryCard__limit}>
          / {limit}
        </Text>
      </View>

      <View style={styles.budgetSummaryCard__track}>
        <View
          style={[
            styles.budgetSummaryCard__progress,
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
  budgetSummaryCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  budgetSummaryCard__name: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  budgetSummaryCard__percent: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  budgetSummaryCard__values: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  budgetSummaryCard__spent: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  budgetSummaryCard__limit: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    marginLeft: 4,
  },

  budgetSummaryCard__track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  budgetSummaryCard__progress: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});