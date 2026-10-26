import React, { useEffect, useState } from "react";
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

const formatMoney = (value: number) =>
  `${value.toLocaleString("vi-VN")} đ`;

export default function SavingsGoal({ onBack }: SavingsGoalProps) {
  const [goal, setGoal] = useState<GoalData | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const [goalRes, transRes] = await Promise.all([
        axiosClient.get("/savings-goals"),
        axiosClient.get(`/transactions?month=${month}&year=${year}`),
      ]);

      const data: GoalResponse | null =
        goalRes.data?.goal ?? goalRes.data;

      if (
        data &&
        !Array.isArray(data) &&
        data.target_amount != null
      ) {
        setGoal({
          id: data.id,
          name: data.title,
          target_amount: Number(data.target_amount) || 0,
        });
      } else {
        setGoal(null);
      }

      const summary = transRes.data?.summary;

      setCurrentBalance(
        Math.max(Number(summary?.balance ?? 0), 0)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().catch((err) => {
      console.log("Lỗi lấy mục tiêu:", err);
      Alert.alert("Lỗi", "Không thể tải dữ liệu mục tiêu tiết kiệm.");
    });
  }, []);

  const handleSaveGoal = async (data: GoalFormData) => {
    await axiosClient.post("/savings-goals", {
      title: data.name.trim(),
      targetAmount: data.target_amount,
    });

    await fetchData();
  };

  const target = goal?.target_amount ?? 0;
  const saved = currentBalance;

  const percent =
    target > 0
      ? Math.min(Math.round((saved / target) * 100), 100)
      : 0;

  return (
    <SafeAreaView style={styles.savingsGoal}>
      <View style={styles.savingsGoal__header}>
        <TouchableOpacity onPress={onBack}>
          <Feather
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.savingsGoal__heading}>
          <Text style={styles.savingsGoal__title}>
            Mục tiêu tiết kiệm
          </Text>

          <Text style={styles.savingsGoal__subtitle}>
            Theo dõi tiến độ tiết kiệm của bạn
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.savingsGoal__content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.savingsGoal__intro}>
          <View style={styles.savingsGoal__icon}>
            <Feather
              name="target"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.savingsGoal__heading}>
            <Text style={styles.savingsGoal__sectionTitle}>
              Kế hoạch tiết kiệm
            </Text>

            <Text style={styles.savingsGoal__label}>
              Đặt mục tiêu và theo dõi tiến độ
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.savingsGoal__button}
          disabled={loading}
          onPress={() => setShowModal(true)}
        >
          <Feather
            name={goal ? "edit-2" : "plus"}
            size={20}
            color={colors.textInverse}
          />

          <Text style={styles.savingsGoal__buttonText}>
            {goal ? "Điều chỉnh mục tiêu" : "Thiết lập mục tiêu"}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        ) : !goal ? (
          <View style={styles.savingsGoal__card}>
            <EmptyState text="Bạn chưa thiết lập mục tiêu tiết kiệm" />
          </View>
        ) : (
          <View style={styles.savingsGoal__card}>
            <View style={styles.savingsGoal__row}>
              <Text style={styles.savingsGoal__sectionTitle}>
                {goal.name || "Mục tiêu tiết kiệm"}
              </Text>

              <Feather
                name="target"
                size={22}
                color={colors.primary}
              />
            </View>

            <Text style={styles.savingsGoal__label}>
              Số tiền mục tiêu
            </Text>

            <Text style={styles.savingsGoal__amount}>
              {formatMoney(target)}
            </Text>

            <View style={styles.savingsGoal__row}>
              <Text style={styles.savingsGoal__label}>
                Tiến độ hoàn thành
              </Text>

              <Text style={styles.savingsGoal__percent}>
                {percent}%
              </Text>
            </View>

            <View style={styles.savingsGoal__progress}>
              <View
                style={[
                  styles.savingsGoal__progressFill,
                  {
                    width: `${percent}%` as `${number}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.savingsGoal__row}>
              <View>
                <Text style={styles.savingsGoal__label}>
                  Số dư tháng này
                </Text>

                <Text style={styles.savingsGoal__value}>
                  {formatMoney(saved)}
                </Text>
              </View>

              <View>
                <Text style={styles.savingsGoal__label}>
                  Còn thiếu
                </Text>

                <Text style={styles.savingsGoal__value}>
                  {formatMoney(Math.max(target - saved, 0))}
                </Text>
              </View>
            </View>
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
  savingsGoal: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  savingsGoal__header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  savingsGoal__heading: {
    flex: 1,
    gap: 4,
  },

  savingsGoal__title: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  savingsGoal__subtitle: {
    fontSize: fonts.size.xs,
    color: colors.textMuted,
  },

  savingsGoal__content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  savingsGoal__intro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  savingsGoal__icon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  savingsGoal__sectionTitle: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  savingsGoal__label: {
    fontSize: fonts.size.sm,
    color: colors.textMuted,
  },

  savingsGoal__button: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  savingsGoal__buttonText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },

  savingsGoal__card: {
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  savingsGoal__row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  savingsGoal__amount: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },

  savingsGoal__percent: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.primary,
  },

  savingsGoal__progress: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },

  savingsGoal__progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  savingsGoal__value: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginTop: 4,
  },
});