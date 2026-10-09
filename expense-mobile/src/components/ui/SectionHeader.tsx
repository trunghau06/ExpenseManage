import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface SectionHeaderProps {
  title: string;
  avatarUri?: string | null;
  onNotificationPress?: () => void;
  onAccountPress?: () => void;
}

export default function SectionHeader({
  avatarUri,
  onNotificationPress,
  onAccountPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeader__left}>
        <View style={styles.sectionHeader__logo}>
          <Feather
            name="bar-chart-2"
            size={28}
            color={colors.textInverse}
          />
        </View>

        <Text
          style={styles.sectionHeader__title}
          numberOfLines={1}
        >
          FinFlow
        </Text>
      </View>

      <View style={styles.sectionHeader__actions}>
        <TouchableOpacity
          style={styles.sectionHeader__notification}
          activeOpacity={0.8}
          onPress={onNotificationPress}
        >
          <Feather
            name="bell"
            size={19}
            color={colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sectionHeader__avatar}
          activeOpacity={0.8}
          onPress={onAccountPress}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.sectionHeader__avatarImage}
            />
          ) : (
            <Feather
              name="user"
              size={19}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  sectionHeader__left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sectionHeader__logo: {
    width: 48,
    height: 48,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  sectionHeader__title: {
    flex: 1,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },

  sectionHeader__actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionHeader__notification: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },

  sectionHeader__avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  sectionHeader__avatarImage: {
    width: '100%',
    height: '100%',
  },
});