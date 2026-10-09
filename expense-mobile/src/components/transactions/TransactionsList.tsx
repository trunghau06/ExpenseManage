import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import EmptyState from '../ui/EmptyState';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export interface TransactionItem {
  id: string;
  title: string;
  category: string;
  date: string;
  paymentMethod: string;
  amount: string;
  type: 'INCOME' | 'EXPENSE';
}

interface TransactionsListProps {
  items?: TransactionItem[];
  onItemPress?: (item: TransactionItem) => void;
}

export default function TransactionsList({
  items = [],
  onItemPress,
}: TransactionsListProps) {
  return (
    <View style={styles.transactionsList}>
      <View style={styles.transactionsList__header}>
        <Text style={styles.transactionsList__title}>
          Danh sách giao dịch
        </Text>

        <Text style={styles.transactionsList__count}>
          {items.length} giao dịch
        </Text>
      </View>

      {items.length === 0 ? (
        <EmptyState text="Chưa có dữ liệu giao dịch" />
      ) : (
        <View style={styles.transactionsList__items}>
          {items.map((item) => {
            const isIncome = item.type === 'INCOME';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.transactionsList__item}
                activeOpacity={0.8}
                onPress={() => onItemPress?.(item)}
              >
                <View style={styles.transactionsList__icon}>
                  <Feather
                    name={
                      isIncome
                        ? 'arrow-down-left'
                        : 'arrow-up-right'
                    }
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.transactionsList__content}>
                  <View style={styles.transactionsList__top}>
                    <Text
                      style={styles.transactionsList__name}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.transactionsList__amount,
                        isIncome
                          ? styles.transactionsList__amountIncome
                          : styles.transactionsList__amountExpense,
                      ]}
                    >
                      {item.amount}
                    </Text>
                  </View>

                  <Text
                    style={styles.transactionsList__category}
                    numberOfLines={1}
                  >
                    {item.category}
                  </Text>

                  <View style={styles.transactionsList__bottom}>
                    <View style={styles.transactionsList__detail}>
                      <Feather
                        name="calendar"
                        size={13}
                        color={colors.textMuted}
                      />

                      <Text style={styles.transactionsList__detailText}>
                        {item.date}
                      </Text>
                    </View>

                    <View style={styles.transactionsList__detail}>
                      <Feather
                        name="credit-card"
                        size={13}
                        color={colors.textMuted}
                      />

                      <Text style={styles.transactionsList__detailText}>
                        {item.paymentMethod}
                      </Text>
                    </View>
                  </View>
                </View>

                <Feather
                  name="chevron-right"
                  size={17}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsList: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  transactionsList__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  transactionsList__title: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  transactionsList__count: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    color: colors.textMuted,
  },

  transactionsList__items: {
    gap: 2,
  },

  transactionsList__item: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  transactionsList__icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },

  transactionsList__content: {
    flex: 1,
  },

  transactionsList__top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  transactionsList__name: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  transactionsList__amount: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
  },

  transactionsList__amountIncome: {
    color: colors.income,
  },

  transactionsList__amountExpense: {
    color: colors.expense,
  },

  transactionsList__category: {
    marginTop: 3,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  transactionsList__bottom: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  transactionsList__detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  transactionsList__detailText: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
});