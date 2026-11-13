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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axiosClient from "../api/axiosClient";
import EmptyState from "../components/ui/EmptyState";
import BudgetModal, {
  type BudgetCategory,
} from "../components/modal/BudgetModal";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

interface BudgetItem {
  id: string | number;
  categoryId: string | number;
  categoryName: string;
  amount: number;
  spent: number;
}

interface BudgetData {
  id: string | number;
  category_id: string | number;
  amount: number | string;
}

interface CategoryData extends BudgetCategory {
  type: string;
}

interface TransactionData {
  type: string;
  amount: number | string;
  category_id?: string | number;
  category?: {
    id?: string | number;
  } | null;
}

interface BudgetProps {
  onBack: () => void;
  initialMonth?: number;
  initialYear?: number;
}

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

export default function Budget({
  onBack,
  initialMonth,
  initialYear,
}: BudgetProps) {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(
    () =>
      new Date(
        initialYear ?? now.getFullYear(),
        (initialMonth ?? now.getMonth() + 1) - 1,
        1,
      ),
  );
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [budgetRes, categoryRes, transRes] = await Promise.all([
        axiosClient.get(`/budgets?month=${month}&year=${year}`),
        axiosClient.get("/categories"),
        axiosClient.get(`/transactions?month=${month}&year=${year}`),
      ]);

      const budgetData: BudgetData[] = Array.isArray(budgetRes.data)
        ? budgetRes.data
        : (budgetRes.data?.budgets ?? []);

      const categoryData: CategoryData[] = Array.isArray(categoryRes.data)
        ? categoryRes.data
        : (categoryRes.data?.categories ?? []);

      const transactions: TransactionData[] = transRes.data?.transactions ?? [];

      const expenseCategories = categoryData.filter(
        (item) => item.type?.toUpperCase() === "EXPENSE",
      );

      setCategories(expenseCategories);

      const mappedBudgets: BudgetItem[] = budgetData.map((item) => {
        const category = expenseCategories.find(
          (cat) => String(cat.id) === String(item.category_id),
        );

        const spent = transactions
          .filter(
            (transaction) =>
              transaction.type === "EXPENSE" &&
              String(transaction.category_id ?? transaction.category?.id) ===
                String(item.category_id),
          )
          .reduce(
            (sum, transaction) => sum + Number(transaction.amount || 0),
            0,
          );

        return {
          id: item.id,
          categoryId: item.category_id,
          categoryName: category?.name || "Danh mục khác",
          amount: Number(item.amount),
          spent,
        };
      });

      setBudgets(mappedBudgets);
    } catch (error) {
      console.log("Lỗi tải ngân sách:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu ngân sách.");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const changeMonth = (offset: number) => {
    setSelectedDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  const handleSaveBudget = async (
    categoryId: string | number,
    amount: number,
  ) => {
    if (editingBudget) {
      await axiosClient.put(`/budgets/${editingBudget.id}`, {
        amount,
      });
    } else {
      await axiosClient.post("/budgets", {
        category_id: categoryId,
        amount,
        month,
        year,
      });
    }

    await fetchData();
  };

  const totalLimit = budgets.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = budgets.reduce((sum, item) => sum + item.spent, 0);
  const totalPercent =
    totalLimit > 0
      ? Math.min(Math.max((totalSpent / totalLimit) * 100, 0), 100)
      : 0;

  const availableCategories = categories.filter(
    (category) =>
      !budgets.some(
        (budget) => String(budget.categoryId) === String(category.id),
      ),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.heading}>
          <Text style={styles.title}>Ngân sách</Text>
          <Text style={styles.subtitle}>
            Quản lý và theo dõi hạn mức chi tiêu
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.month}>
          <TouchableOpacity
            onPress={() => changeMonth(-1)}
            style={styles.monthButton}
          >
            <Feather name="chevron-left" size={22} color={colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            Tháng {month}/{year}
          </Text>
          <TouchableOpacity
            onPress={() => changeMonth(1)}
            style={styles.monthButton}
          >
            <Feather name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setEditingBudget(null);
            setShowModal(true);
          }}
        >
          <Feather name="plus" size={20} color={colors.textInverse} />
          <Text style={styles.buttonText}>Thiết lập hạn mức</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : budgets.length === 0 ? (
          <View style={styles.card}>
            <EmptyState text="Chưa có ngân sách nào được thiết lập" />
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.iconRow}>
                <MaterialCommunityIcons
                  name="wallet"
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Tổng quan ngân sách</Text>
              </View>
              <Text style={styles.label}>Tổng hạn mức</Text>
              <Text style={styles.amount}>{formatMoney(totalLimit)}</Text>
              <View style={styles.progress}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${totalPercent}%` as `${number}%`,
                      backgroundColor:
                        totalSpent > totalLimit
                          ? colors.expense
                          : colors.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.summary}>
                <View>
                  <Text style={styles.label}>Đã sử dụng</Text>
                  <Text style={styles.spent}>{formatMoney(totalSpent)}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.label}>Còn lại</Text>
                  <Text
                    style={[
                      styles.remaining,
                      totalSpent > totalLimit && {
                        color: colors.expense,
                      },
                    ]}
                  >
                    {formatMoney(totalLimit - totalSpent)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.between}>
              <Text style={styles.sectionTitle}>Ngân sách theo danh mục</Text>
              <Text style={styles.label}>{budgets.length} danh mục</Text>
            </View>
            {budgets.map((item) => {
              const percent =
                item.amount > 0
                  ? Math.round((item.spent / item.amount) * 100)
                  : 0;

              return (
                <View key={String(item.id)} style={styles.card}>
                  <View style={styles.between}>
                    <Text style={styles.categoryName}>{item.categoryName}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingBudget(item);
                        setShowModal(true);
                      }}
                    >
                      <Feather name="edit-2" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.between}>
                    <Text style={styles.label}>
                      {formatMoney(item.spent)} / {formatMoney(item.amount)}
                    </Text>
                    <Text
                      style={[
                        styles.percent,
                        percent >= 100 && { color: colors.expense },
                      ]}
                    >
                      {percent}%
                    </Text>
                  </View>
                  <View style={styles.progress}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width:
                            `${Math.min(Math.max(percent, 0), 100)}%` as `${number}%`,
                          backgroundColor:
                            percent >= 100 ? colors.expense : colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.label}>
                    {percent > 100
                      ? "Đã vượt hạn mức"
                      : percent === 100
                        ? "Đã sử dụng hết hạn mức"
                        : percent >= 80
                          ? "Sắp hết ngân sách"
                          : "Trong hạn mức"}
                  </Text>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
      <BudgetModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBudget(null);
        }}
        categories={editingBudget ? categories : availableCategories}
        month={month}
        year={year}
        initialBudget={editingBudget}
        onSave={handleSaveBudget}
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
  month: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  monthButton: {
    padding: 6,
  },
  monthText: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
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
    marginTop: 4,
  },
  amount: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  right: {
    alignItems: "flex-end",
  },
  spent: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.expense,
  },
  remaining: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.income,
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
  categoryName: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    flexShrink: 1,
  },
  percent: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.primary,
  },
});
