import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import EmptyState from '../ui/EmptyState';
import SectionCard from '../ui/SectionCard';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface FinancialHealthCardProps {
  savingRate?: number | null;
  status?: string | null;
}

export default function FinancialHealthCard({
  savingRate,
  status,
}: FinancialHealthCardProps) {
  if (
    savingRate == null ||
    !status
  ) {
    return (
      <SectionCard title="Sức khỏe tài chính">
        <EmptyState />
      </SectionCard>
    );
  }

  const safeRate =
    Math.min(
      Math.max(savingRate, 0),
      100
    );

  const progressWidth =
    `${safeRate}%` as `${number}%`;

  return (
    <SectionCard title="Sức khỏe tài chính">
      <View style={styles.financialHealthCard__header}>
        <View style={styles.financialHealthCard__icon}>
          <Feather
            name="activity"
            size={20}
            color={colors.primary}
          />
        </View>

        <View style={styles.financialHealthCard__content}>
          <Text style={styles.financialHealthCard__label}>
            Tỷ lệ tiết kiệm
          </Text>

          <Text style={styles.financialHealthCard__status}>
            {status}
          </Text>
        </View>

        <Text style={styles.financialHealthCard__value}>
          {safeRate}%
        </Text>
      </View>

      <View style={styles.financialHealthCard__track}>
        <View
          style={[
            styles.financialHealthCard__progress,
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
  financialHealthCard__header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  financialHealthCard__icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  financialHealthCard__content: {
    flex: 1,
  },

  financialHealthCard__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 3,
  },

  financialHealthCard__status: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  financialHealthCard__value: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },

  financialHealthCard__track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  financialHealthCard__progress: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});