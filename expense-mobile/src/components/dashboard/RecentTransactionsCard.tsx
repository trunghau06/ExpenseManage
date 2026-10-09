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

interface TransactionItem {
  id: string;
  name: string;
  category: string;
  amount: string;
  time: string;
  type: 'INCOME' | 'EXPENSE';
}

interface RecentTransactionsCardProps {
  items?: TransactionItem[];
}

export default function RecentTransactionsCard({
  items = [],
}: RecentTransactionsCardProps) {
  if (items.length === 0) {
    return (
      <SectionCard
        title="Giao dịch gần đây"
        rightText="Xem tất cả"
      >
        <EmptyState />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Giao dịch gần đây"
      rightText="Xem tất cả"
    >
      <View style={styles.recentTransactionsCard__list}>
        {items.map((item) => {
          const isIncome =
            item.type === 'INCOME';

          return (
            <View
              key={item.id}
              style={styles.recentTransactionsCard__item}
            >
              <View style={styles.recentTransactionsCard__left}>
                <View style={styles.recentTransactionsCard__icon}>
                  <Feather
                    name={
                      isIncome
                        ? 'arrow-down-left'
                        : 'arrow-up-right'
                    }
                    size={17}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.recentTransactionsCard__info}>
                  <Text
                    style={styles.recentTransactionsCard__name}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={styles.recentTransactionsCard__detail}
                    numberOfLines={1}
                  >
                    {item.category}
                    {' · '}
                    {item.time}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.recentTransactionsCard__amount,
                  {
                    color: isIncome
                      ? colors.income
                      : colors.expense,
                  },
                ]}
              >
                {item.amount}
              </Text>
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  recentTransactionsCard__list: {
    gap: 16,
  },

  recentTransactionsCard__item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  recentTransactionsCard__left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  recentTransactionsCard__icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.focusRing,
  },

  recentTransactionsCard__info: {
    flex: 1,
  },

  recentTransactionsCard__name: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },

  recentTransactionsCard__detail: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  recentTransactionsCard__amount: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
  },
});