
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { AppDispatch } from '../../store/store';
import { logout } from '../../features/auth/authSlice';

interface SecurityCardProps {
  onChangePasswordPress?: () => void;
}

export default function SecurityCard({
  onChangePasswordPress,
}: SecurityCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            if (isLoggingOut) return;

            try {
              setIsLoggingOut(true);
              await dispatch(logout()).unwrap();
            } catch (error) {
              console.log('Lỗi đăng xuất:', error);
              Alert.alert(
                'Lỗi',
                'Không thể đăng xuất. Vui lòng thử lại.'
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.securityCard}>
      <View style={styles.securityCard__header}>
        <Text style={styles.securityCard__title}>
          Bảo mật
        </Text>

        <Text style={styles.securityCard__subtitle}>
          Quản lý mật khẩu và bảo mật tài khoản
        </Text>
      </View>

      <TouchableOpacity
        style={styles.securityCard__item}
        activeOpacity={0.8}
        onPress={onChangePasswordPress}
      >
        <View style={styles.securityCard__icon}>
          <Feather
            name="lock"
            size={18}
            color={colors.primary}
          />
        </View>

        <View style={styles.securityCard__content}>
          <Text style={styles.securityCard__label}>
            Đổi mật khẩu
          </Text>

          <Text style={styles.securityCard__description}>
            Cập nhật mật khẩu đăng nhập
          </Text>
        </View>

        <Feather
          name="chevron-right"
          size={18}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      <View style={styles.securityCard__divider} />

      <TouchableOpacity
        style={styles.securityCard__item}
        activeOpacity={0.8}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        <View style={styles.securityCard__icon}>
          <Feather
            name="log-out"
            size={18}
            color={colors.expense}
          />
        </View>

        <View style={styles.securityCard__content}>
          <Text style={[styles.securityCard__label, { color: colors.expense }]}>
            Đăng xuất
          </Text>

          <Text style={styles.securityCard__description}>
            Thoát khỏi tài khoản hiện tại
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
  securityCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  securityCard__header: {
    marginBottom: 16,
  },

  securityCard__title: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },

  securityCard__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  securityCard__item: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  securityCard__icon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  securityCard__content: {
    flex: 1,
  },

  securityCard__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 3,
  },

  securityCard__description: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  securityCard__divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
});
