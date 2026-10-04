import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import axiosClient from '../api/axiosClient';

export default function Register() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const passwordStrength = useMemo(() => {
    if (!password) {
      return { score: 0, label: 'Bảo mật', color: colors.border };
    }

    let points = 0;
    if (password.length >= 8) points += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) points += 1;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) points += 1;

    if (points === 1) {
      return { score: 1, label: 'Yếu', color: colors.expense };
    }
    if (points === 2) {
      return { score: 2, label: 'Trung bình', color: '#F59E0B' };
    }
    if (points === 3) {
      return { score: 3, label: 'Mạnh', color: colors.income };
    }

    return { score: 1, label: 'Yếu', color: colors.expense };
  }, [password]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      return 'Vui lòng nhập họ và tên';
    }
    if (!email.trim()) {
      return 'Vui lòng nhập email';
    }
    if (!emailRegex.test(email.trim())) {
      return 'Email không hợp lệ';
    }
    if (password.length < 8) {
      return 'Mật khẩu phải chứa ít nhất 8 ký tự';
    }
    if (passwordStrength.score < 2) {
      return 'Mật khẩu quá yếu (cần kết hợp chữ hoa, chữ thường và số)';
    }
    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    if (!agreeTerms) {
      return 'Vui lòng đồng ý với Điều khoản và Chính sách bảo mật';
    }
    return null;
  };

  const handleRegister = async () => {
    setErrorMessage('');
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      navigation.navigate('Login');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.bgAuthGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.container__safe}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <KeyboardAvoidingView
          style={styles.container__keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.container__scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.topbar}>
              <TouchableOpacity
                style={styles.topbar__back}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="arrow-left" size={24} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.topbar__brand}>
                <LinearGradient
                  colors={colors.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.topbar__icon}
                >
                  <FontAwesome5 name="chart-bar" size={16} color={colors.textInverse} />
                </LinearGradient>
                <Text style={styles.topbar__brandText}>FINFLOW</Text>
              </View>
            </View>

            <View style={styles.formRegister__greeting}>
              <Text style={styles.formRegister__title}>Tạo tài khoản mới</Text>
              <Text style={styles.formRegister__subtitle}>
                Bắt đầu kiểm soát tài chính cá nhân hiệu quả từ hôm nay
              </Text>
            </View>

            {errorMessage ? (
              <View style={styles.formRegister__errorBox}>
                <Text style={styles.formRegister__errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.formRegister}>
              <View style={styles.inputFrame}>
                <View style={styles.labelWrapper}>
                  <Text style={styles.inputFrame__label}>Họ và tên</Text>
                  <Text style={styles.inputHint}>Bắt buộc</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={18} color={colors.neutral} style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Nguyễn Văn A"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={(val) => {
                      setName(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <View style={styles.inputFrame}>
                <View style={styles.labelWrapper}>
                  <Text style={styles.inputFrame__label}>Email</Text>
                  <Text style={styles.inputHint}>Bắt buộc</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={18} color={colors.neutral} style={styles.inputIcon} />
                  <TextInput
                    ref={emailInputRef}
                    style={styles.inputField}
                    placeholder="nguyenvana@gmail.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <View style={styles.inputFrame}>
                <View style={styles.labelWrapper}>
                  <Text style={styles.inputFrame__label}>Mật khẩu</Text>
                  <Text style={styles.inputHint}>Ít nhất 8 ký tự</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color={colors.neutral} style={styles.inputIcon} />
                  <TextInput
                    ref={passwordInputRef}
                    style={[styles.inputField, styles.inputFieldPassword]}
                    placeholder="Ít nhất 8 ký tự"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.togglePasswordIcon}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={colors.neutral}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formRegister__strength}>
                <View style={styles.formRegister__track}>
                  <View
                    style={[
                      styles.formRegister__segment,
                      {
                        backgroundColor:
                          passwordStrength.score >= 1 ? passwordStrength.color : colors.border,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.formRegister__segment,
                      {
                        backgroundColor:
                          passwordStrength.score >= 2 ? passwordStrength.color : colors.border,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.formRegister__segment,
                      {
                        backgroundColor:
                          passwordStrength.score >= 3 ? passwordStrength.color : colors.border,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.formRegister__strengthLabel,
                    passwordStrength.score > 0 && { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.label}
                </Text>
              </View>

              <View style={styles.inputFrame}>
                <View style={styles.labelWrapper}>
                  <Text style={styles.inputFrame__label}>Xác nhận mật khẩu</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Feather name="rotate-ccw" size={18} color={colors.neutral} style={styles.inputIcon} />
                  <TextInput
                    ref={confirmPasswordInputRef}
                    style={[styles.inputField, styles.inputFieldPassword]}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.togglePasswordIcon}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={colors.neutral}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.formRegister__terms}
                activeOpacity={0.8}
                onPress={() => {
                  setAgreeTerms(!agreeTerms);
                  if (errorMessage) setErrorMessage('');
                }}
              >
                <View style={[styles.formRegister__checkbox, agreeTerms && styles.formRegister__checkboxActive]}>
                  {agreeTerms && <Feather name="check" size={14} color={colors.textInverse} />}
                </View>
                <Text style={styles.formRegister__checkboxLabel}>
                  Tôi đồng ý với{' '}
                  <Text style={styles.termsLink}>Điều khoản sử dụng</Text> và{' '}
                  <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.formRegister__btn, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.textInverse} />
                ) : (
                  <>
                    <Text style={styles.formRegister__btnText}>Đăng ký tài khoản</Text>
                    <Feather name="arrow-right" size={20} color={colors.textInverse} />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.formRegister__other}>
                <Text style={styles.formRegister__otherText}>Đã có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                >
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container__safe: {
    flex: 1,
  },
  container__keyboard: {
    flex: 1,
  },
  container__scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 60,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  topbar__back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  topbar__brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topbar__icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.36,
    shadowRadius: 8,
    elevation: 4,
  },
  topbar__brandText: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  formRegister__greeting: {
    marginBottom: 20,
  },
  formRegister__title: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    marginBottom: 8,
  },
  formRegister__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    lineHeight: 20,
  },
  formRegister__errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.expense,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  formRegister__errorText: {
    color: colors.expense,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    textAlign: 'center',
  },
  formRegister: {
    width: '100%',
  },
  inputFrame: {
    marginBottom: 16,
  },
  labelWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputFrame__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },
  inputHint: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  togglePasswordIcon: {
    position: 'absolute',
    right: 14,
    padding: 4,
    zIndex: 1,
  },
  inputField: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 42,
    paddingRight: 16,
    fontSize: fonts.size.base,
    color: colors.text,
  },
  inputFieldPassword: {
    paddingRight: 42,
  },
  formRegister__strength: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: -4,
  },
  formRegister__track: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    marginRight: 12,
  },
  formRegister__segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  formRegister__strengthLabel: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
  formRegister__terms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
    gap: 10,
  },
  formRegister__checkbox: {
    width: 20,
    height: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  formRegister__checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  formRegister__checkboxLabel: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: fonts.weight.medium,
  },
  formRegister__btn: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  formRegister__btnText: {
    color: colors.textInverse,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semiBold,
  },
  formRegister__other: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formRegister__otherText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
  loginLink: {
    fontSize: fonts.size.sm,
    color: colors.primary,
    fontWeight: fonts.weight.semiBold,
  },
});