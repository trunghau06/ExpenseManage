import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface EmptyStateProps {
  text?: string;
}

export default function EmptyState({
  text = 'Chưa có dữ liệu',
}: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Feather
        name="inbox"
        size={22}
        color={colors.textMuted}
      />

      <Text style={styles.emptyState__text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  emptyState__text: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
});