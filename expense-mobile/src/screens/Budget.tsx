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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

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
}

const formatMoney = (value: number) =>
  `${value.toLocaleString("vi-VN")} đ`;

export default function Budget({ onBack }: BudgetProps) {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [budgetRes, categoryRes, transRes] = await Promise.all([
        axiosClient.get(`/budgets?month=${month}&year=${year}`),
        axiosClient.get("/categories"),
        axiosClient.get(`/transactions?month=${month}&year=${year}`),
      ]);

      const budgetData: BudgetData[] = Array.isArray(budgetRes.data)
        ? budgetRes.data
        : budgetRes.data?.budgets ?? [];

      const categoryData: CategoryData[] = Array.isArray(categoryRes.data)
        ? categoryRes.data
        : categoryRes.data?.categories ?? [];

      const transactions: TransactionData[] =
        transRes.data.transactions ?? [];

      const expenseCategories = categoryData.filter(
        (item) => item.type?.toUpperCase() === "EXPENSE"
      );

      setCategories(expenseCategories);

      const mappedBudgets: BudgetItem[] = budgetData.map((item) => {
        const category = expenseCategories.find(
          (cat) => String(cat.id) === String(item.category_id)
        );

        const spent = transactions
          .filter(
            (transaction) =>
              transaction.type === "EXPENSE" &&
              String(
                transaction.category_id ?? transaction.category?.id
              ) === String(item.category_id)
          )
          .reduce(
            (sum, transaction) => sum + Number(transaction.amount),
            0
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
    } catch (err) {
      console.log("Lỗi lấy dữ liệu ngân sách:", err);
      Alert.alert("Lỗi", "Không thể tải dữ liệu ngân sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBudget = async (
    categoryId: string | number,
    amount: number
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

  const totalLimit = budgets.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalSpent = budgets.reduce(
    (sum, item) => sum + item.spent,
    0
  );

  const totalPercent =
    totalLimit > 0
      ? Math.min((totalSpent / totalLimit) * 100, 100)
      : 0;

  const availableCategories = categories.filter(
    (category) =>
      !budgets.some(
        (budget) =>
          String(budget.categoryId) === String(category.id)
      )
  );

  return (
    <SafeAreaView style={styles.budget}>
      <View style={styles.budget__header}>
        <TouchableOpacity onPress={onBack}>
          <Feather
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.budget__title}>
            Ngân sách
          </Text>

          <Text style={styles.budget__subtitle}>
            Quản lý và theo dõi hạn mức chi tiêu
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.budget__content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.budget__month}>
          <Feather
            name="chevron-left"
            size={22}
            color={colors.textMuted}
          />

          <Text style={styles.budget__monthText}>
            Tháng {month}/{year}
          </Text>

          <Feather
            name="chevron-right"
            size={22}
            color={colors.textMuted}
          />
        </View>

        <TouchableOpacity
          style={styles.budget__button}
          onPress={() => {
            setEditingBudget(null);
            setShowModal(true);
          }}
        >
          <Feather
            name="plus"
            size={20}
            color={colors.textInverse}
          />

          <Text style={styles.budget__buttonText}>
            Thiết lập hạn mức
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        ) : budgets.length === 0 ? (
          <EmptyState text="Chưa có ngân sách nào được thiết lập" />
        ) : (
          <>
            <View style={styles.budget__card}>
              <View style={styles.budget__row}>
                <MaterialCommunityIcons
                  name="wallet"
                  size={22}
                  color={colors.primary}
                />

                <Text style={styles.budget__sectionTitle}>
                  Tổng quan ngân sách
                </Text>
              </View>

              <Text style={styles.budget__label}>
                Tổng hạn mức
              </Text>

              <Text style={styles.budget__amount}>
                {formatMoney(totalLimit)}
              </Text>

              <View style={styles.budget__progress}>
                <View
                  style={[
                    styles.budget__progressFill,
                    {
                      width: `${totalPercent}%` as `${number}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.budget__summary}>
                <View>
                  <Text style={styles.budget__label}>
                    Đã sử dụng
                  </Text>

                  <Text style={styles.budget__spent}>
                    {formatMoney(totalSpent)}
                  </Text>
                </View>

                <View>
                  <Text style={styles.budget__label}>
                    Còn lại
                  </Text>

                  <Text style={styles.budget__remaining}>
                    {formatMoney(totalLimit - totalSpent)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.budget__between}>
              <Text style={styles.budget__sectionTitle}>
                Ngân sách theo danh mục
              </Text>

              <Text style={styles.budget__label}>
                {budgets.length} danh mục
              </Text>
            </View>

            {budgets.map((item) => {
              const percent =
                item.amount > 0
                  ? Math.round(
                      (item.spent / item.amount) * 100
                    )
                  : 0;

              return (
                <View
                  key={String(item.id)}
                  style={styles.budget__card}
                >
                  <View style={styles.budget__between}>
                    <Text style={styles.budget__categoryName}>
                      {item.categoryName}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setEditingBudget(item);
                        setShowModal(true);
                      }}
                    >
                      <Feather
                        name="edit-2"
                        size={18}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.budget__between}>
                    <Text style={styles.budget__label}>
                      {formatMoney(item.spent)} /{" "}
                      {formatMoney(item.amount)}
                    </Text>

                    <Text style={styles.budget__percent}>
                      {percent}%
                    </Text>
                  </View>

                  <View style={styles.budget__progress}>
                    <View
                      style={[
                        styles.budget__progressFill,
                        {
                          width: `${Math.min(
                            Math.max(percent, 0),
                            100
                          )}%` as `${number}%`,
                          backgroundColor:
                            percent >= 100
                              ? colors.expense
                              : colors.primary,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.budget__label}>
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
  budget: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  budget__header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  budget__title: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  budget__subtitle: {
    fontSize: fonts.size.xs,
    color: colors.textMuted,
  },

  budget__content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  budget__month: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },

  budget__monthText: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  budget__button: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  budget__buttonText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },

  budget__card: {
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },

  budget__row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  budget__between: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },

  budget__sectionTitle: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  budget__label: {
    fontSize: fonts.size.sm,
    color: colors.textMuted,
    marginTop: 4,
  },

  budget__amount: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },

  budget__summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  budget__spent: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.expense,
  },

  budget__remaining: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.income,
  },

  budget__progress: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },

  budget__progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  budget__categoryName: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  budget__percent: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.primary,
  },
});