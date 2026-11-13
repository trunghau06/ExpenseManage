
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
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
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await dispatch(logout()).unwrap();
      setLogoutVisible(false);
    } catch (error) {
      console.log('Lỗi đăng xuất:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeLogoutModal = () => {
    if (!isLoggingOut) setLogoutVisible(false);
  };

  return (
    <View style={styles.securityCard}>
      <View style={styles.securityCard__header}>
        <Text style={styles.securityCard__title}>Bảo mật</Text>
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
          <Feather name="lock" size={18} color={colors.primary} />
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
        onPress={() => setLogoutVisible(true)}
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
          <Text
            style={[
              styles.securityCard__label,
              { color: colors.expense },
            ]}
          >
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

      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeLogoutModal}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeLogoutModal}
          />

          <View style={styles.modal}>
            <View style={styles.logoutIcon}>
              <Feather
                name="log-out"
                size={26}
                color={colors.expense}
              />
            </View>

            <Text style={styles.modalTitle}>
              Xác nhận đăng xuất
            </Text>

            <Text style={styles.modalDescription}>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
              Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng FinFlow.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeLogoutModal}
                disabled={isLoggingOut}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isLoggingOut && styles.disabled,
                ]}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.surface}
                  />
                ) : (
                  <Feather
                    name="log-out"
                    size={17}
                    color={colors.surface}
                  />
                )}
                <Text style={styles.confirmText}>
                  {isLoggingOut ? 'Đang thoát...' : 'Đăng xuất'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  securityCard__subtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  logoutIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  modalDescription: {
    marginTop: 10,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
    lineHeight: 21,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 26,
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  cancelText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textMuted,
  },
  confirmButton: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    backgroundColor: colors.expense,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.surface,
  },
  disabled: {
    opacity: 0.6,
  },
});
