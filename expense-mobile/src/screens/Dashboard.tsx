import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={styles.header}>
        <View>
          <Text style={styles.header__title}>Dashboard</Text>
          <Text style={styles.header__subtitle}>Khu vực thực hành sau đăng nhập</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <Feather name="log-out" size={18} color={colors.expense} />
          <Text style={styles.logoutBtn__text}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Feather name="code" size={32} color={colors.textMuted} />
        <Text style={styles.content__text}>UI đã sẵn sàng để bạn tự nối logic và API</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header__title: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },
  header__subtitle: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutBtn__text: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.expense,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  content__text: {
    fontSize: fonts.size.base,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
