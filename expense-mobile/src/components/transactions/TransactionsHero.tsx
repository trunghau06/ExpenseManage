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

interface TransactionsHeroProps {
  onAddPress?: () => void;
}

export default function TransactionsHero({
  onAddPress,
}: TransactionsHeroProps) {
  return (
    <View style={styles.transactionsHero}>
      <View style={styles.transactionsHero__content}>
        <Text style={styles.transactionsHero__title}>
          Sổ Giao Dịch
        </Text>

        <Text style={styles.transactionsHero__subtitle}>
          Số lượng giao dịch trong kỳ
        </Text>
      </View>

      <TouchableOpacity
        style={styles.transactionsHero__button}
        activeOpacity={0.8}
        onPress={onAddPress}
      >
        <Feather
          name="plus"
          size={18}
          color={colors.textInverse}
        />

        <Text style={styles.transactionsHero__buttonText}>
          Thêm
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsHero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  transactionsHero__content: {
    flex: 1,
  },

  transactionsHero__title: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    marginBottom: 4,
  },

  transactionsHero__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    lineHeight: 20,
  },

  transactionsHero__button: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
  },

  transactionsHero__buttonText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },
});