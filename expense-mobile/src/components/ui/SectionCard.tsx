import React, {
  ReactNode,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  rightText?: string;
  onRightPress?: () => void;
}

export default function SectionCard({
  title,
  children,
  rightText,
  onRightPress,
}: SectionCardProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionCard__header}>
        <Text style={styles.sectionCard__title}>
          {title}
        </Text>

        {rightText && (
          <TouchableOpacity onPress={onRightPress} disabled={!onRightPress}>
            <Text style={styles.sectionCard__rightText}>
              {rightText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowCard,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },

  sectionCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionCard__title: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  sectionCard__rightText: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.medium,
    color: colors.primary,
    marginTop: 2,
  },
});