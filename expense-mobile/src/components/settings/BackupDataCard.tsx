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

interface BackupDataCardProps {
  onExportPress?: () => void;
}

export default function BackupDataCard({
  onExportPress,
}: BackupDataCardProps) {
  return (
    <View style={styles.backupDataCard}>
      <View style={styles.backupDataCard__header}>
        <Text style={styles.backupDataCard__title}>
          Dữ liệu
        </Text>

        <Text style={styles.backupDataCard__subtitle}>
          Quản lý dữ liệu tài chính của bạn
        </Text>
      </View>

      <TouchableOpacity
        style={styles.backupDataCard__item}
        activeOpacity={0.8}
        onPress={onExportPress}
      >
        <View style={styles.backupDataCard__icon}>
          <Feather
            name="download"
            size={18}
            color={colors.primary}
          />
        </View>

        <View style={styles.backupDataCard__content}>
          <Text style={styles.backupDataCard__label}>
            Sao lưu dữ liệu
          </Text>

          <Text style={styles.backupDataCard__description}>
            Xuất dữ liệu tài chính của bạn
          </Text>
        </View>

        <Feather
          name="chevron-right"
          size={18}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backupDataCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  backupDataCard__header: {
    marginBottom: 16,
  },

  backupDataCard__title: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },

  backupDataCard__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  backupDataCard__item: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  backupDataCard__icon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  backupDataCard__content: {
    flex: 1,
  },

  backupDataCard__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 3,
  },

  backupDataCard__description: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
});