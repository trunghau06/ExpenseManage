import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axiosClient from "../api/axiosClient";
import EmptyState from "../components/ui/EmptyState";
import SavingsGoalModal, {
  type GoalData,
  type GoalFormData,
} from "../components/modal/SavingsGoalModal";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

interface SavingsGoalProps {
  onBack: () => void;
}

interface GoalResponse {
  id?: string | number;
  title: string;
  target_amount: number | string;
}

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

export default function SavingsGoal({ onBack }: SavingsGoalProps) {
  const [goal, setGoal] = useState<GoalData | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [goalRes, balanceRes] = await Promise.all([
        axiosClient.get("/savings-goals"),
        axiosClient.get("/balance"),
      ]);

      const data: GoalResponse | null = goalRes.data?.goal ?? goalRes.data;

      if (data && !Array.isArray(data) && data.target_amount != null) {
        setGoal({
          id: data.id,
          name: data.title,
          target_amount: Number(data.target_amount) || 0,
        });
      } else {
        setGoal(null);
      }

      setCurrentBalance(
        Math.max(Number(balanceRes.data?.currentBalance ?? 0), 0),
      );
    } catch (error) {
      console.log("Lỗi tải mục tiêu tiết kiệm:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu mục tiêu tiết kiệm.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleSaveGoal = async (data: GoalFormData) => {
    await axiosClient.post("/savings-goals", {
      title: data.name.trim(),
      targetAmount: data.target_amount,
    });
    await fetchData();
  };

  const target = Number(goal?.target_amount ?? 0);
  const saved = currentBalance;
  const percent =
    target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;
  const remaining = Math.max(target - saved, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.heading}>
          <Text style={styles.title}>Mục tiêu tiết kiệm</Text>
          <Text style={styles.subtitle}>
            Theo dõi tiến độ tiết kiệm của bạn
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <View style={styles.icon}>
            <Feather name="target" size={24} color={colors.primary} />
          </View>
          <View style={styles.heading}>
            <Text style={styles.sectionTitle}>Kế hoạch tiết kiệm</Text>
            <Text style={styles.label}>
              Đặt mục tiêu và theo dõi tiến độ tích lũy
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={loading}
          onPress={() => setShowModal(true)}
        >
          <Feather
            name={goal ? "edit-2" : "plus"}
            size={20}
            color={colors.textInverse}
          />
          <Text style={styles.buttonText}>
            {goal ? "Điều chỉnh mục tiêu" : "Thiết lập mục tiêu"}
          </Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : !goal ? (
          <View style={styles.card}>
            <EmptyState text="Bạn chưa thiết lập mục tiêu tiết kiệm" />
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>
                {goal.name || "Mục tiêu tiết kiệm"}
              </Text>
              <Feather name="target" size={22} color={colors.primary} />
            </View>
            <Text style={styles.label}>Số tiền mục tiêu</Text>
            <Text style={styles.amount}>{formatMoney(target)}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Tiến độ hoàn thành</Text>
              <Text style={styles.percent}>{percent}%</Text>
            </View>
            <View style={styles.progress}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${percent}%` as `${number}%` },
                ]}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Đã tích lũy</Text>
                <Text style={styles.value}>{formatMoney(saved)}</Text>
              </View>
              <View style={[styles.column, styles.right]}>
                <Text style={styles.label}>Còn thiếu</Text>
                <Text style={styles.value}>{formatMoney(remaining)}</Text>
              </View>
            </View>
            {percent >= 100 && (
              <View style={styles.completed}>
                <Feather name="check-circle" size={18} color={colors.income} />
                <Text style={styles.completedText}>
                  Bạn đã đạt mục tiêu tiết kiệm!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <SavingsGoalModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        goal={goal}
        onSave={handleSaveGoal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heading: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fonts.size.xs,
    color: colors.textMuted,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  intro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    flexShrink: 1,
  },
  label: {
    fontSize: fonts.size.sm,
    color: colors.textMuted,
  },
  button: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },
  card: {
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },
  percent: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.primary,
  },
  progress: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  value: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginTop: 4,
  },
  completed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
  },
  completedText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.income,
  },
});
