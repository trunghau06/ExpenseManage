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

interface InfoCardProps {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarUri?: string | null;
  onEditPress?: () => void;
}

export default function InfoCard({
  name,
  email,
  phone,
  avatarUri,
  onEditPress,
}: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCard__header}>
        <View>
          <Text style={styles.infoCard__title}>
            Thông tin cá nhân
          </Text>

          <Text style={styles.infoCard__subtitle}>
            Quản lý thông tin tài khoản của bạn
          </Text>
        </View>

        <TouchableOpacity
          style={styles.infoCard__editButton}
          activeOpacity={0.8}
          onPress={onEditPress}
        >
          <Feather
            name="edit-2"
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard__profile}>
        <View style={styles.infoCard__avatar}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.infoCard__avatarImage}
            />
          ) : (
            <Feather
              name="user"
              size={28}
              color={colors.primary}
            />
          )}
        </View>

        <View style={styles.infoCard__profileContent}>
          <Text style={styles.infoCard__name}>
            {name || 'Chưa có dữ liệu'}
          </Text>

          <Text style={styles.infoCard__email}>
            {email || 'Chưa có dữ liệu'}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard__details}>
        <View style={styles.infoCard__detail}>
          <View style={styles.infoCard__detailIcon}>
            <Feather
              name="mail"
              size={16}
              color={colors.primary}
            />
          </View>

          <View style={styles.infoCard__detailContent}>
            <Text style={styles.infoCard__detailLabel}>
              Email
            </Text>

            <Text style={styles.infoCard__detailValue}>
              {email || 'Chưa có dữ liệu'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard__detail}>
          <View style={styles.infoCard__detailIcon}>
            <Feather
              name="phone"
              size={16}
              color={colors.primary}
            />
          </View>

          <View style={styles.infoCard__detailContent}>
            <Text style={styles.infoCard__detailLabel}>
              Số điện thoại
            </Text>

            <Text style={styles.infoCard__detailValue}>
              {phone || 'Chưa có dữ liệu'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  infoCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },

  infoCard__title: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },

  infoCard__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  infoCard__editButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  infoCard__profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  infoCard__avatar: {
    width: 60,
    height: 60,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },

  infoCard__avatarImage: {
    width: '100%',
    height: '100%',
  },

  infoCard__profileContent: {
    flex: 1,
  },

  infoCard__name: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    marginBottom: 4,
  },

  infoCard__email: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  infoCard__details: {
    gap: 16,
    marginTop: 18,
  },

  infoCard__detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoCard__detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  infoCard__detailContent: {
    flex: 1,
  },

  infoCard__detailLabel: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    marginBottom: 3,
  },

  infoCard__detailValue: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.text,
  },
});