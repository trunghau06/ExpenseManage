import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../api/axiosClient";
import SectionHeader from "../components/ui/SectionHeader";
import InfoCard from "../components/settings/InfoCard";
import SecurityCard from "../components/settings/SecurityCard";
import CategoryCard, {
  SettingCategory,
} from "../components/settings/CategoryCard";
import BackupDataCard from "../components/settings/BackupDataCard";
import EditProfileModal from "../components/settings/EditProfileModal";
import { AppDispatch, RootState } from "../store/store";
import { updateUser } from "../features/auth/authSlice";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
}

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [categories, setCategories] = useState<SettingCategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const loadData = useCallback(async () => {
    try {
      const [userResponse, categoryResponse] = await Promise.all([
        axiosClient.get("/users/me"),
        axiosClient.get("/categories"),
      ]);
      const nextProfile: Profile = userResponse.data?.user || userResponse.data;
      const nextCategories = Array.isArray(categoryResponse.data)
        ? categoryResponse.data
        : categoryResponse.data?.categories || [];
      setProfile(nextProfile);
      setCategories(
        nextCategories.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          type: item.type,
          icon: item.icon,
        })),
      );
      dispatch(updateUser(nextProfile));
    } catch (error) {
      console.log("Không thể tải cài đặt:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin cài đặt.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const avatarPath = profile?.avatar_url || user?.avatar_url;
  const apiBase = String(axiosClient.defaults.baseURL || "").replace(
    /\/api\/?$/,
    "",
  );
  const avatarUri = avatarPath
    ? /^https?:\/\//i.test(avatarPath)
      ? avatarPath
      : `${apiBase}${avatarPath}`
    : null;
  return (
    <SafeAreaView style={styles.settings}>
      <ScrollView
        contentContainerStyle={styles.settings__content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
          />
        }
      >
        <SectionHeader />
        <View style={styles.settings__header}>
          <Text style={styles.settings__title}>Cài đặt</Text>
          <Text style={styles.settings__subtitle}>
            Quản lý tài khoản và tùy chỉnh FinFlow
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <InfoCard
              name={profile?.name || user?.name}
              email={profile?.email || user?.email}
              phone={profile?.phone || user?.phone}
              avatarUri={avatarUri}
              onEditPress={() => setEditVisible(true)}
            />
            <SecurityCard
              onChangePasswordPress={() =>
                Alert.alert(
                  "Chưa hỗ trợ",
                  "Backend hiện chưa có API đổi mật khẩu. Không thể cập nhật mật khẩu lúc này.",
                )
              }
            />
            <CategoryCard categories={categories} onChanged={loadData} />
            <BackupDataCard />
          </>
        )}
      </ScrollView>
      <EditProfileModal
        visible={editVisible}
        phone={profile?.phone || user?.phone || ""}
        onClose={() => setEditVisible(false)}
        onSaved={() => {
          setEditVisible(false);
          loadData();
        }}
      />
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
    paddingBottom: 40,
    gap: 16,
  },
  settings__header: {
    gap: 4,
  },
  settings__title: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },
  settings__subtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
