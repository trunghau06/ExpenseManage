import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
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
  Budget: { month: number; year: number };
  SavingGoal: undefined;
};

interface DashboardHomeProps {
  onBudgetPress: (month: number, year: number) => void;
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

interface BudgetData {
  category_id: string | number;
  amount: number | string;
}

interface SavingsGoalData {
  title: string;
  target_amount: number | string;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: string;
  percent: number;
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

const Stack = createNativeStackNavigator<DashboardStackParamList>();
const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

function DashboardHome({
  onBudgetPress,
  onTransactionsPress,
  onStatPress,
  onGoalPress,
}: DashboardHomeProps) {
  const [period, setPeriod] = useState<DashboardPeriod>("current");
  const [balance, setBalance] = useState<number | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState<number | null>(null);
  const [expense, setExpense] = useState<number | null>(null);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(
    null,
  );
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransactionItem[]
  >([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const now = new Date();
  const selectedDate =
    period === "previous"
      ? new Date(now.getFullYear(), now.getMonth() - 1, 1)
      : now;
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  const periodLabel = period === "current" ? "Tháng này" : "Tháng trước";

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchDashboard = async () => {
        setLoading(true);

        try {
          const [transRes, budgetRes, goalRes, balanceRes] = await Promise.all([
            axiosClient.get(`/transactions?month=${month}&year=${year}`),
            axiosClient.get(`/budgets?month=${month}&year=${year}`),
            axiosClient.get("/savings-goals"),
            axiosClient.get("/balance"),
          ]);

          if (!active) return;

          const summary = transRes.data?.summary ?? {};
          const transactions: TransactionData[] =
            transRes.data?.transactions ?? [];
          const budgets: BudgetData[] = Array.isArray(budgetRes.data)
            ? budgetRes.data
            : (budgetRes.data?.budgets ?? []);

          const totalIncome = Number(summary.totalIncome ?? 0);
          const totalExpense = Number(summary.totalExpense ?? 0);

          setBalance(Number(summary.balance ?? 0));
          setIncome(totalIncome);
          setExpense(totalExpense);
          setTotalBalance(Number(balanceRes.data?.currentBalance ?? 0));

          const grouped = new Map<string, number>();

          transactions
            .filter((item) => item.type === "EXPENSE")
            .forEach((item) => {
              const name = item.category?.name || "Khác";
              const amount = Number(item.amount);

              if (!Number.isFinite(amount) || amount <= 0) return;
              grouped.set(name, (grouped.get(name) ?? 0) + amount);
            });

          const expenses: ExpenseItem[] = [...grouped.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([name, amount]) => ({
              id: name,
              name,
              amount: formatMoney(amount),
              percent:
                totalExpense > 0
                  ? Math.round((amount / totalExpense) * 100)
                  : 0,
            }));

          setExpenseItems(expenses);

          const recent: RecentTransactionItem[] = [...transactions]
            .filter((item) => item.type === "INCOME" || item.type === "EXPENSE")
            .sort(
              (a, b) =>
                new Date(b.transaction_date).getTime() -
                new Date(a.transaction_date).getTime(),
            )
            .slice(0, 5)
            .map((item) => ({
              id: String(item.id),
              name: item.note?.trim() || item.category?.name || "Giao dịch",
              category: item.category?.name || "Khác",
              amount: `${item.type === "INCOME" ? "+" : "-"}${formatMoney(Number(item.amount))}`,
              time: new Date(item.transaction_date).toLocaleDateString("vi-VN"),
              type: item.type as "INCOME" | "EXPENSE",
            }));

          setRecentTransactions(recent);

          const totalLimit = budgets.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0,
          );

          const budgetCategories = new Set(
            budgets.map((item) => String(item.category_id)),
          );

          const totalSpent = transactions
            .filter(
              (item) =>
                item.type === "EXPENSE" &&
                budgetCategories.has(
                  String(item.category_id ?? item.category?.id),
                ),
            )
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

          setBudgetSummary(
            budgets.length > 0 && totalLimit > 0
              ? {
                  name: "Tiến độ ngân sách",
                  spent: formatMoney(totalSpent),
                  limit: formatMoney(totalLimit),
                  progress: Math.round((totalSpent / totalLimit) * 100),
                }
              : null,
          );

          const goalData: SavingsGoalData | null =
            goalRes.data?.goal ?? goalRes.data;

          setSavingsGoal(
            goalData &&
              !Array.isArray(goalData) &&
              goalData.target_amount != null
              ? goalData
              : null,
          );
        } catch (error) {
          if (!active) return;

          console.log("Lỗi tải Dashboard:", error);
          setBalance(null);
          setIncome(null);
          setExpense(null);
          setExpenseItems([]);
          setBudgetSummary(null);
          setRecentTransactions([]);
          setSavingsGoal(null);
        } finally {
          if (active) {
            setLoading(false);
            setRefreshing(false);
          }
        }
      };

      fetchDashboard();
      return () => {
        active = false;
      };
    }, [month, year, reloadKey]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setReloadKey((value) => value + 1);
  };

  const goalTarget = Number(savingsGoal?.target_amount ?? 0);
  const goalSaved = Math.max(totalBalance, 0);
  const goalPercent =
    goalTarget > 0
      ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <SectionHeader />
        <View style={styles.greeting}>
          <Text style={styles.title}>Tổng Quan Giao Dịch</Text>
          <Text style={styles.subtitle}>{formatDate()}</Text>
        </View>
        <BalanceSummaryCard
          period={period}
          balance={balance !== null ? formatMoney(balance) : null}
          income={income !== null ? formatMoney(income) : null}
          expense={expense !== null ? formatMoney(expense) : null}
        />
        <PeriodTabs value={period} onChange={setPeriod} />
        <QuickActions
          onTransactionsPress={onTransactionsPress}
          onBudgetPress={() => onBudgetPress(month, year)}
          onStatPress={onStatPress}
          onGoalPress={onGoalPress}
        />
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
        <ExpenseAllocationCard
          periodLabel={periodLabel}
          items={expenseItems}
          total={expense !== null ? formatMoney(expense) : null}
        />
        <BudgetSummaryCard
          onViewAll={() => onBudgetPress(month, year)}
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
            <View style={styles.goal}>
              <Text style={styles.goalName}>
                {savingsGoal.title || "Mục tiêu tiết kiệm"}
              </Text>
              <Text style={styles.goalAmount}>{formatMoney(goalTarget)}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Tiến độ hoàn thành</Text>
                <Text style={styles.percent}>{goalPercent}%</Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${goalPercent}%` as `${number}%` },
                  ]}
                />
              </View>
              <View style={styles.row}>
                <View>
                  <Text style={styles.label}>Đã tích lũy</Text>
                  <Text style={styles.value}>{formatMoney(goalSaved)}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.label}>Còn thiếu</Text>
                  <Text style={styles.value}>
                    {formatMoney(Math.max(goalTarget - goalSaved, 0))}
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
            onBudgetPress={(month, year) =>
              navigation.navigate("Budget", { month, year })
            }
            onTransactionsPress={() =>
              navigation.getParent()?.navigate("Transactions")
            }
            onStatPress={() => navigation.getParent()?.navigate("Stats")}
            onGoalPress={() => navigation.navigate("SavingGoal")}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Budget">
        {({ navigation, route }) => (
          <Budget
            onBack={() => navigation.goBack()}
            initialMonth={route.params.month}
            initialYear={route.params.year}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SavingGoal">
        {({ navigation }) => <SavingsGoal onBack={() => navigation.goBack()} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 16,
  },
  greeting: {
    gap: 4,
  },
  title: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
  },
  goal: {
    gap: 8,
  },
  goalName: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },
  goalAmount: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
  },
  percent: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.primary,
  },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  value: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginTop: 4,
  },
  right: {
    alignItems: "flex-end",
  },
});
