import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";

import axiosClient from "../api/axiosClient";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { formatDate } from "../utils/formatDate";

import SectionHeader from "../components/ui/SectionHeader";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";
import BalanceSummaryCard from "../components/dashboard/BalanceSummaryCard";
import PeriodTabs, {
  type DashboardPeriod,
} from "../components/dashboard/PeriodTabs";
import QuickActions from "../components/dashboard/QuickActions";
import ExpenseAllocationCard from "../components/dashboard/ExpenseAllocationCard";
import BudgetSummaryCard from "../components/dashboard/BudgetSummaryCard";
import RecentTransactionsCard from "../components/dashboard/RecentTransactionsCard";
import Budget from "./Budget";
import SavingsGoal from "./SavingsGoal";

type DashboardStackParamList = {
  DashboardHome: undefined;
  Budget: undefined;
  SavingGoal: undefined;
};

interface DashboardHomeProps {
  onBudgetPress: () => void;
  onTransactionsPress: () => void;
  onStatPress: () => void;
  onGoalPress: () => void;
}

interface TransactionData {
  id: string | number;
  type: string;
  amount: number | string;
  note?: string | null;
  transaction_date: string;
  category_id?: string | number;
  category?: {
    id?: string | number;
    name: string;
  } | null;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: string;
  percent: number;
}

interface BudgetData {
  category_id: string | number;
  amount: number | string;
}

interface BudgetSummary {
  name: string;
  spent: string;
  limit: string;
  progress: number;
}

interface RecentTransactionItem {
  id: string;
  name: string;
  category: string;
  amount: string;
  time: string;
  type: "INCOME" | "EXPENSE";
}

interface SavingsGoalData {
  title: string;
  target_amount: number | string;
}

const Stack = createNativeStackNavigator<DashboardStackParamList>();

function DashboardHome({
  onBudgetPress,
  onTransactionsPress,
  onStatPress,
  onGoalPress,
}: DashboardHomeProps) {
  const [period, setPeriod] = useState<DashboardPeriod>("current");
  const [balance, setBalance] = useState<number | null>(null);
  const [totalBalance, setTotalBalance] = useState<number>(0);  
  const [income, setIncome] = useState<number | null>(null);
  const [expense, setExpense] = useState<number | null>(null);

  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [budgetSummary, setBudgetSummary] =
    useState<BudgetSummary | null>(null);
  const [recentTransactions, setRecentTransactions] =
    useState<RecentTransactionItem[]>([]);
  const [savingsGoal, setSavingsGoal] =
    useState<SavingsGoalData | null>(null);

  const isFocused = useIsFocused();
  const periodLabel = period === "current" ? "Tháng này" : "Tháng trước";

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    const fetchDashboard = async () => {
      try {
        const now = new Date();
        const selectedDate =
          period === "previous"
            ? new Date(now.getFullYear(), now.getMonth() - 1, 1)
            : now;

        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

        const [transRes, budgetRes, goalRes, balanceRes] = await Promise.all([
          axiosClient.get(`/transactions?month=${month}&year=${year}`),
          axiosClient.get(`/budgets?month=${month}&year=${year}`),
          axiosClient.get("/savings-goals"),
          axiosClient.get("/balance"),
        ]);

        if (!active) return;

        const summary = transRes.data?.summary;

        const transactions: TransactionData[] =
          transRes.data?.transactions ?? [];

        const budgets: BudgetData[] = Array.isArray(budgetRes.data)
          ? budgetRes.data
          : budgetRes.data?.budgets ?? [];

        const totalIncome = Number(summary?.totalIncome ?? 0);
        const totalExpense = Number(summary?.totalExpense ?? 0);
        const currentBalance = Number(summary?.balance ?? 0);

        setBalance(currentBalance);
        setIncome(totalIncome);
        setExpense(totalExpense);
        setTotalBalance(Number(balanceRes.data?.currentBalance ?? 0));  

        const grouped: { name: string; amount: number }[] = [];

        transactions
          .filter((item) => item.type === "EXPENSE")
          .forEach((item) => {
            const name = item.category?.name || "Khác";
            const amount = Number(item.amount);

            if (!Number.isFinite(amount) || amount <= 0) return;

            const existing = grouped.find(
              (category) => category.name === name
            );

            if (existing) {
              existing.amount += amount;
            } else {
              grouped.push({ name, amount });
            }
          });

        const items: ExpenseItem[] = grouped
          .sort((a, b) => b.amount - a.amount)
          .map((item) => ({
            id: item.name,
            name: item.name,
            amount: `${item.amount.toLocaleString("vi-VN")} đ`,
            percent:
              totalExpense > 0
                ? Math.round((item.amount / totalExpense) * 100)
                : 0,
          }));

        setExpenseItems(items);

        const recent: RecentTransactionItem[] = [...transactions]
          .filter(
            (item) =>
              item.type === "INCOME" || item.type === "EXPENSE"
          )
          .sort(
            (a, b) =>
              new Date(b.transaction_date).getTime() -
              new Date(a.transaction_date).getTime()
          )
          .slice(0, 5)
          .map((item) => ({
            id: String(item.id),
            name:
              item.note?.trim() ||
              item.category?.name ||
              "Giao dịch",
            category: item.category?.name || "Khác",
            amount: `${
              item.type === "INCOME" ? "+" : "-"
            }${Number(item.amount).toLocaleString("vi-VN")} đ`,
            time: new Date(item.transaction_date).toLocaleDateString(
              "vi-VN"
            ),
            type: item.type as "INCOME" | "EXPENSE",
          }));

        setRecentTransactions(recent);

        const totalLimit = budgets.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );

        const totalSpent = transactions
          .filter(
            (item) =>
              item.type === "EXPENSE" &&
              budgets.some(
                (budget) =>
                  String(budget.category_id) ===
                  String(item.category_id ?? item.category?.id)
              )
          )
          .reduce(
            (sum, item) => sum + Number(item.amount),
            0
          );

        if (budgets.length > 0 && totalLimit > 0) {
          setBudgetSummary({
            name: "Tiến độ ngân sách",
            spent: `${totalSpent.toLocaleString("vi-VN")} đ`,
            limit: `${totalLimit.toLocaleString("vi-VN")} đ`,
            progress: Math.round((totalSpent / totalLimit) * 100),
          });
        } else {
          setBudgetSummary(null);
        }
        const goalData: SavingsGoalData | null =
          goalRes.data?.goal ?? goalRes.data;
        if (
          goalData &&
          !Array.isArray(goalData) &&
          goalData.target_amount != null
        ) {
          setSavingsGoal(goalData);
        } else {
          setSavingsGoal(null);
        }
      } catch (err) {
        if (!active) return;
        console.log("Lỗi tải Dashboard:", err);
        setBalance(null);
        setIncome(null);
        setExpense(null);
        setExpenseItems([]);
        setBudgetSummary(null);
        setRecentTransactions([]);
        setSavingsGoal(null);
      }
    };

    fetchDashboard();

    return () => {
      active = false;
    };
  }, [period, isFocused]);

  const goalTarget = Number(savingsGoal?.target_amount ?? 0);
  const goalSaved = Math.max(totalBalance, 0);

  const goalPercent =
    goalTarget > 0
      ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100)
      : 0;

  return (
    <SafeAreaView style={styles.dashboard}>
      <ScrollView
        contentContainerStyle={styles.dashboard__content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader />

        <View style={styles.dashboard__greeting}>
          <Text style={styles.dashboard__greetingTitle}>
            Tổng Quan Giao Dịch
          </Text>

          <Text style={styles.dashboard__greetingSubtitle}>
            {formatDate()}
          </Text>
        </View>

        <BalanceSummaryCard
          period={period}
          balance={
            balance !== null
              ? `${balance.toLocaleString("vi-VN")} đ`
              : null
          }
          income={
            income !== null
              ? `${income.toLocaleString("vi-VN")} đ`
              : null
          }
          expense={
            expense !== null
              ? `${expense.toLocaleString("vi-VN")} đ`
              : null
          }
        />

        <PeriodTabs value={period} onChange={setPeriod} />
        <QuickActions
          onTransactionsPress={onTransactionsPress}
          onBudgetPress={onBudgetPress}
          onStatPress={onStatPress}
          onGoalPress={onGoalPress}
        />
        <ExpenseAllocationCard
          periodLabel={periodLabel}
          items={expenseItems}
          total={
            expense !== null
              ? `${expense.toLocaleString("vi-VN")} đ`
              : null
          }
        />
        <BudgetSummaryCard
          onViewAll={onBudgetPress}
          name={budgetSummary?.name}
          spent={budgetSummary?.spent}
          limit={budgetSummary?.limit}
          progress={budgetSummary?.progress}
        />
        <SectionCard
          title="Mục tiêu tiết kiệm"
          rightText="Xem tất cả"
          onRightPress={onGoalPress}
        >
          {!savingsGoal ? (
            <EmptyState text="Chưa có mục tiêu tiết kiệm" />
          ) : (
            <View style={styles.dashboard__goal}>
              <Text style={styles.dashboard__goalName}>
                {savingsGoal.title || "Mục tiêu tiết kiệm"}
              </Text>

              <Text style={styles.dashboard__goalAmount}>
                {goalTarget.toLocaleString("vi-VN")} đ
              </Text>

              <View style={styles.dashboard__goalRow}>
                <Text style={styles.dashboard__goalLabel}>
                  Tiến độ hoàn thành
                </Text>

                <Text style={styles.dashboard__goalPercent}>
                  {goalPercent}%
                </Text>
              </View>

              <View style={styles.dashboard__goalTrack}>
                <View
                  style={[
                    styles.dashboard__goalFill,
                    {
                      width: `${goalPercent}%` as `${number}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.dashboard__goalRow}>
                <View>
                  <Text style={styles.dashboard__goalLabel}>
                    Đã tích lũy
                  </Text>

                  <Text style={styles.dashboard__goalValue}>
                    {goalSaved.toLocaleString("vi-VN")} đ
                  </Text>
                </View>

                <View>
                  <Text style={styles.dashboard__goalLabel}>
                    Còn thiếu
                  </Text>

                  <Text style={styles.dashboard__goalValue}>
                    {Math.max(
                      goalTarget - goalSaved,
                      0
                    ).toLocaleString("vi-VN")} đ
                  </Text>
                </View>
              </View>
            </View>
          )}
        </SectionCard>
        <RecentTransactionsCard
          items={recentTransactions}
          onViewAll={onTransactionsPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function Dashboard() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome">
        {({ navigation }) => (
          <DashboardHome
            onBudgetPress={() => navigation.navigate("Budget")}
            onTransactionsPress={() =>
              navigation.getParent()?.navigate("Transactions")
            }
            onStatPress={() =>
              navigation.getParent()?.navigate("Stats")
            }
            onGoalPress={() => navigation.navigate("SavingGoal")}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Budget">
        {({ navigation }) => (
          <Budget onBack={() => navigation.goBack()} />
        )}
      </Stack.Screen>

      <Stack.Screen name="SavingGoal">
        {({ navigation }) => (
          <SavingsGoal onBack={() => navigation.goBack()} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  dashboard__content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 16,
  },

  dashboard__greeting: {
    gap: 4,
  },

  dashboard__greetingTitle: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  dashboard__greetingSubtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  dashboard__goal: {
    gap: 8,
  },

  dashboard__goalName: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  dashboard__goalLabel: {
    fontSize: fonts.size.sm,
    color: colors.textMuted,
  },

  dashboard__goalAmount: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },

  dashboard__goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  dashboard__goalPercent: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.primary,
  },

  dashboard__goalTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },

  dashboard__goalFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  dashboard__goalValue: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginTop: 4,
  },
});