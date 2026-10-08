import React, {
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import * as SecureStore from 'expo-secure-store';

import {
  useDispatch,
} from 'react-redux';

import axiosClient, {
  setAuthToken,
} from '../api/axiosClient';

import {
  loginSuccess,
} from '../features/auth/authSlice';

import {
  AppDispatch,
} from '../store/store';

import {
  RootStackParamList,
} from '../navigation/RootNavigator';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type LoginNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    'Login'
  >;

export default function Login() {
  const navigation =
    useNavigation<LoginNavigationProp>();

  const dispatch =
    useDispatch<AppDispatch>();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const passwordInputRef =
    useRef<TextInput>(null);

  const handleSubmit = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError(
        'Vui lòng nhập đầy đủ email và mật khẩu'
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await axiosClient.post(
          '/auth/login',
          {
            email: email.trim(),
            password,
          }
        );

      const {
        token,
        user,
      } = response.data;

      setAuthToken(token);

      if (rememberMe) {
        await SecureStore.setItemAsync(
          'token',
          token
        );

        await SecureStore.setItemAsync(
          'user',
          JSON.stringify(user)
        );
      } else {
        await SecureStore.deleteItemAsync(
          'token'
        );

        await SecureStore.deleteItemAsync(
          'user'
        );
      }

      dispatch(
        loginSuccess({
          token,
          user,
        })
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Đăng nhập thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.bgAuthGradient}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 0.8,
        y: 1,
      }}
      style={styles.container}
    >
      <SafeAreaView
        style={styles.container__safe}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        <KeyboardAvoidingView
          style={
            styles.container__keyboard
          }
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          keyboardVerticalOffset={
            Platform.OS === 'ios'
              ? 0
              : 20
          }
        >
          <ScrollView
            contentContainerStyle={
              styles.container__scroll
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View
              style={
                styles.formLogin__header
              }
            >
              <LinearGradient
                colors={
                  colors.iconGradient
                }
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 1,
                }}
                style={
                  styles.formLogin__logo
                }
              >
                <FontAwesome5
                  name="chart-bar"
                  size={24}
                  color={
                    colors.textInverse
                  }
                />
              </LinearGradient>

              <View
                style={
                  styles.formLogin__brandRow
                }
              >
                <Text
                  style={
                    styles.formLogin__brandName
                  }
                >
                  FinFlow
                </Text>

                <View
                  style={
                    styles.formLogin__brandDot
                  }
                />
              </View>

              <Text
                style={
                  styles.formLogin__brandSlogan
                }
              >
                Quản lý tài chính cá nhân
                thông minh & tối giản
              </Text>
            </View>

            <View
              style={
                styles.formLogin__greeting
              }
            >
              <Text
                style={
                  styles.formLogin__title
                }
              >
                Đăng nhập
              </Text>

              <Text
                style={
                  styles.formLogin__subtitle
                }
              >
                Chào mừng bạn quay trở lại!
              </Text>
            </View>

            {error ? (
              <View
                style={
                  styles.formLogin__errorBox
                }
              >
                <Text
                  style={
                    styles.formLogin__errorText
                  }
                >
                  {error}
                </Text>
              </View>
            ) : null}

            <View
              style={styles.formLogin}
            >
              <View
                style={styles.inputFrame}
              >
                <Text
                  style={
                    styles.inputFrame__label
                  }
                >
                  Email
                </Text>

                <View
                  style={styles.inputWrapper}
                >
                  <Feather
                    name="mail"
                    size={18}
                    color={colors.neutral}
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.inputField}
                    placeholder="vidu@email.com"
                    placeholderTextColor={
                      colors.textMuted
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);

                      if (error) {
                        setError('');
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      passwordInputRef.current?.focus()
                    }
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <View
                style={styles.inputFrame}
              >
                <Text
                  style={
                    styles.inputFrame__label
                  }
                >
                  Mật khẩu
                </Text>

                <View
                  style={styles.inputWrapper}
                >
                  <Feather
                    name="lock"
                    size={18}
                    color={colors.neutral}
                    style={styles.inputIcon}
                  />

                  <TextInput
                    ref={passwordInputRef}
                    style={[
                      styles.inputField,
                      styles.inputFieldPassword,
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor={
                      colors.textMuted
                    }
                    secureTextEntry={
                      !showPassword
                    }
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);

                      if (error) {
                        setError('');
                      }
                    }}
                    returnKeyType="done"
                    onSubmitEditing={
                      handleSubmit
                    }
                  />

                  <TouchableOpacity
                    onPress={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    style={
                      styles.togglePasswordIcon
                    }
                    hitSlop={{
                      top: 8,
                      bottom: 8,
                      left: 8,
                      right: 8,
                    }}
                  >
                    <Feather
                      name={
                        showPassword
                          ? 'eye-off'
                          : 'eye'
                      }
                      size={18}
                      color={
                        colors.neutral
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={
                  styles.formLogin__options
                }
              >
                <TouchableOpacity
                  style={
                    styles.formLogin__remember
                  }
                  activeOpacity={0.8}
                  onPress={() =>
                    setRememberMe(
                      !rememberMe
                    )
                  }
                  hitSlop={{
                    top: 6,
                    bottom: 6,
                    left: 6,
                    right: 6,
                  }}
                >
                  <View
                    style={[
                      styles.formLogin__checkbox,
                      rememberMe &&
                        styles.formLogin__checkboxActive,
                    ]}
                  >
                    {rememberMe && (
                      <Feather
                        name="check"
                        size={14}
                        color={
                          colors.textInverse
                        }
                      />
                    )}
                  </View>

                  <Text
                    style={
                      styles.formLogin__rememberText
                    }
                  >
                    Ghi nhớ đăng nhập
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  hitSlop={{
                    top: 6,
                    bottom: 6,
                    left: 6,
                    right: 6,
                  }}
                >
                  <Text
                    style={
                      styles.forgotPasswordLink
                    }
                  >
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.formLogin__btn,
                  loading && {
                    opacity: 0.7,
                  },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    color={
                      colors.textInverse
                    }
                  />
                ) : (
                  <>
                    <Text
                      style={
                        styles.formLogin__btnText
                      }
                    >
                      Đăng nhập
                    </Text>

                    <Feather
                      name="arrow-right"
                      size={20}
                      color={
                        colors.textInverse
                      }
                    />
                  </>
                )}
              </TouchableOpacity>

              <View
                style={
                  styles.formLogin__other
                }
              >
                <Text
                  style={
                    styles.formLogin__otherText
                  }
                >
                  Chưa có tài khoản?{' '}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      'Register'
                    )
                  }
                  hitSlop={{
                    top: 12,
                    bottom: 12,
                    left: 8,
                    right: 8,
                  }}
                >
                  <Text
                    style={
                      styles.registerLink
                    }
                  >
                    Đăng ký ngay
                  </Text>
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
    paddingTop: 16,
    paddingBottom: 60,
    justifyContent: 'center',
  },
  formLogin__header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  formLogin__logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor:
      colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.36,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 14,
  },
  formLogin__brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  formLogin__brandName: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  formLogin__brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor:
      colors.secondary,
    marginLeft: 4,
  },
  formLogin__brandSlogan: {
    fontSize: fonts.size.sm,
    fontWeight:
      fonts.weight.regular,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  formLogin__greeting: {
    marginBottom: 20,
  },
  formLogin__title: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    marginBottom: 8,
  },
  formLogin__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight:
      fonts.weight.regular,
    color: colors.textMuted,
  },
  formLogin__errorBox: {
    backgroundColor:
      'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.expense,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  formLogin__errorText: {
    color: colors.expense,
    fontSize: fonts.size.sm,
    fontWeight:
      fonts.weight.medium,
    textAlign: 'center',
  },
  formLogin: {
    width: '100%',
  },
  inputFrame: {
    marginBottom: 16,
  },
  inputFrame__label: {
    fontSize: fonts.size.sm,
    fontWeight:
      fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 8,
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
    backgroundColor:
      'rgba(255, 255, 255, 0.9)',
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
  formLogin__options: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  formLogin__remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formLogin__checkbox: {
    width: 20,
    height: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor:
      'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formLogin__checkboxActive: {
    backgroundColor:
      colors.primary,
    borderColor: colors.primary,
  },
  formLogin__rememberText: {
    fontSize: fonts.size.sm,
    fontWeight:
      fonts.weight.regular,
    color: colors.textMuted,
  },
  forgotPasswordLink: {
    fontSize: fonts.size.sm,
    fontWeight:
      fonts.weight.semiBold,
    color: colors.primary,
  },
  formLogin__btn: {
    height: 50,
    backgroundColor:
      colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor:
      colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  formLogin__btnText: {
    color: colors.textInverse,
    fontSize: fonts.size.md,
    fontWeight:
      fonts.weight.semiBold,
  },
  formLogin__other: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formLogin__otherText: {
    fontSize: fonts.size.sm,
    fontWeight:
      fonts.weight.regular,
    color: colors.textMuted,
  },
  registerLink: {
    fontSize: fonts.size.sm,
    color: colors.primary,
    fontWeight:
      fonts.weight.semiBold,
  },
});