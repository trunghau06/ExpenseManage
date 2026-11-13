import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  useSelector,
} from 'react-redux';

import SectionHeader from '../components/ui/SectionHeader';
import InfoCard from '../components/settings/InfoCard';
import SecurityCard from '../components/settings/SecurityCard';
import CategoryCard from '../components/settings/CategoryCard';
import BackupDataCard from '../components/settings/BackupDataCard';

import { RootState } from '../store/store';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const API_URL =
  'http://172.16.0.105:5000';

export default function Settings() {
  const user = useSelector(
    (state: RootState) =>
      state.auth.user
  );

  const avatarUri =
    user?.avatar_url
      ? `${API_URL}${user.avatar_url}`
      : null;

  return (
    <SafeAreaView style={styles.settings}>
      <ScrollView
        contentContainerStyle={styles.settings__content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader />
        <View style={styles.settings__header}>
          <Text style={styles.settings__title}>
            Cài đặt
          </Text>

          <Text style={styles.settings__subtitle}>
            Quản lý tài khoản và tùy chỉnh FinFlow
          </Text>
        </View>

        <InfoCard
          name={user?.name}
          email={user?.email}
          phone={user?.phone}
          avatarUri={avatarUri}
        />

        <SecurityCard />
        <CategoryCard />
        <BackupDataCard />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settings: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  settings__content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },

  settings__header: {
    gap: 4,
  },

  settings__title: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  settings__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
    lineHeight: 20,
  },
});