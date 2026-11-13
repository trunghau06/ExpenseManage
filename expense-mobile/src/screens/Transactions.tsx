import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import axiosClient from "../api/axiosClient";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import SectionHeader from "../components/ui/SectionHeader";
import TransactionsHero from "../components/transactions/TransactionsHero";
import TransactionsMetrics from "../components/transactions/TransactionsMetrics";
import TransactionsFilter, {
  type TransactionFilterType,
} from "../components/transactions/TransactionsFilter";
import TransactionsList, {
  type TransactionItem,
} from "../components/transactions/TransactionsList";
import TransactionFilterModal, {
  type FilterOption,
} from "../components/transactions/TransactionFilterModal";
import TransactionDetailModal, {
  type TransactionDetail,
} from "../components/transactions/TransactionDetailModal";
import AddTransaction from "./AddTransaction";

type TransactionsStackParamList = {
  TransactionsHome: undefined;
  AddTransaction: undefined;
};

interface Category {
  id: string | number;
  name: string;
  type?: string;
}

interface Transaction {
  id: string | number;
  type: "INCOME" | "EXPENSE";
  amount: number | string;
  note?: string | null;
  category_id?: string | number | null;
  category?: Category | null;
  payment_method?: string | null;
  transaction_date: string;
}

interface TransactionsHomeProps {
  onAddPress: () => void;
  refreshKey: number;
}

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const getPeriodKey = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

const getPeriodLabel = (value: string) => {
  if (value === "all") return "Tất cả thời gian";
  const [year, month] = value.split("-");
  return `Tháng ${Number(month)}/${year}`;
};

const getPaymentLabel = (value?: string | null) => {
  if (value === "BANK_TRANSFER") return "Chuyển khoản";
  if (value === "CASH") return "Tiền mặt";
  return value || "Chưa xác định";
};

function TransactionsHome({ onAddPress, refreshKey }: TransactionsHomeProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionFilterType>("ALL");
  const [period, setPeriod] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setErrorMessage("");
    try {
      const [transactionRes, categoryRes] = await Promise.all([
        axiosClient.get("/transactions"),
        axiosClient.get("/categories"),
      ]);
      const transactionData = Array.isArray(transactionRes.data?.transactions)
        ? transactionRes.data.transactions
        : Array.isArray(transactionRes.data)
          ? transactionRes.data
          : [];
      const categoryData = Array.isArray(categoryRes.data)
        ? categoryRes.data
        : Array.isArray(categoryRes.data?.categories)
          ? categoryRes.data.categories
          : [];
      setTransactions(transactionData);
      setCategories(categoryData);
    } catch (error) {
      console.log("Lỗi tải sổ giao dịch:", error);
      setErrorMessage("Không thể tải dữ liệu giao dịch.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData, refreshKey]),
  );

  const periodOptions = useMemo<FilterOption[]>(() => {
    const periods = new Set(
      transactions
        .map((item) => getPeriodKey(item.transaction_date))
        .filter(Boolean),
    );
    return [
      { label: "Tất cả thời gian", value: "all" },
      ...Array.from(periods)
        .sort()
        .reverse()
        .map((value) => ({
          label: getPeriodLabel(value),
          value,
        })),
    ];
  }, [transactions]);

  const categoryOptions = useMemo<FilterOption[]>(
    () => [
      { label: "Tất cả danh mục", value: "all" },
      ...categories.map((category) => ({
        label: category.name,
        value: String(category.id),
      })),
    ],
    [categories],
  );

  const paymentOptions: FilterOption[] = [
    { label: "Tất cả phương thức", value: "all" },
    { label: "Tiền mặt", value: "CASH" },
    { label: "Chuyển khoản", value: "BANK_TRANSFER" },
  ];

  const getCategoryName = useCallback(
    (item: Transaction) => {
      return (
        item.category?.name ||
        categories.find(
          (category) => String(category.id) === String(item.category_id),
        )?.name ||
        "Khác"
      );
    },
    [categories],
  );

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return transactions
      .filter((item) => {
        const matchesSearch =
          !keyword ||
          (item.note || "").toLowerCase().includes(keyword) ||
          getCategoryName(item).toLowerCase().includes(keyword);
        const matchesType = type === "ALL" || item.type === type;
        const matchesPeriod =
          period === "all" || getPeriodKey(item.transaction_date) === period;
        const matchesCategory =
          categoryId === "all" ||
          String(item.category_id ?? item.category?.id) === categoryId;
        const matchesPayment =
          paymentMethod === "all" || item.payment_method === paymentMethod;
        return (
          matchesSearch &&
          matchesType &&
          matchesPeriod &&
          matchesCategory &&
          matchesPayment
        );
      })
      .sort(
        (a, b) =>
          new Date(b.transaction_date).getTime() -
          new Date(a.transaction_date).getTime(),
      );
  }, [
    transactions,
    search,
    type,
    period,
    categoryId,
    paymentMethod,
    getCategoryName,
  ]);

  const metrics = useMemo(
    () =>
      filteredTransactions.reduce(
        (result, item) => {
          const amount = Number(item.amount) || 0;
          if (item.type === "INCOME") result.income += amount;
          if (item.type === "EXPENSE") result.expense += amount;
          return result;
        },
        { income: 0, expense: 0 },
      ),
    [filteredTransactions],
  );

  const transactionItems = useMemo<TransactionItem[]>(
    () =>
      filteredTransactions.map((item) => {
        const categoryName = getCategoryName(item);
        return {
          id: String(item.id),
          title: item.note?.trim() || categoryName,
          category: categoryName,
          date: formatDate(item.transaction_date),
          paymentMethod: getPaymentLabel(item.payment_method),
          amount: `${item.type === "INCOME" ? "+" : "-"}${formatMoney(Number(item.amount) || 0)}`,
          type: item.type,
        };
      }),
    [filteredTransactions, getCategoryName],
  );

  const resetFilters = () => {
    setSearch("");
    setType("ALL");
    setPeriod("all");
    setCategoryId("all");
    setPaymentMethod("all");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(false);
  };

  const handleOpenDetail = (item: TransactionItem) => {
    const transaction = transactions.find(
      (value) => String(value.id) === item.id,
    );
    if (!transaction) return;
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  const handleDelete = () => {
    if (!selectedTransaction || deleting) return;
    const transactionId = selectedTransaction.id;
    Alert.alert(
      "Xóa giao dịch",
      "Bạn có chắc chắn muốn xóa giao dịch này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await axiosClient.delete(`/transactions/${transactionId}`);
              setDetailModalVisible(false);
              setSelectedTransaction(null);
              await fetchData(false);
            } catch (error) {
              console.log("Lỗi xóa giao dịch:", error);
              Alert.alert("Lỗi", "Không thể xóa giao dịch. Vui lòng thử lại.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const detail: TransactionDetail | null = selectedTransaction
    ? {
        id: selectedTransaction.id,
        type: selectedTransaction.type,
        amount: selectedTransaction.amount,
        categoryName: getCategoryName(selectedTransaction),
        date: formatDate(selectedTransaction.transaction_date),
        paymentMethod: getPaymentLabel(selectedTransaction.payment_method),
        note: selectedTransaction.note || "",
      }
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <SectionHeader />
        <TransactionsHero onAddPress={onAddPress} />
        <TransactionsMetrics
          income={formatMoney(metrics.income)}
          expense={formatMoney(metrics.expense)}
          balance={formatMoney(metrics.income - metrics.expense)}
        />
        <TransactionsFilter
          search={search}
          type={type}
          periodLabel={getPeriodLabel(period)}
          onSearchChange={setSearch}
          onTypeChange={setType}
          onPeriodPress={() => setPeriodModalVisible(true)}
        />
        <View style={styles.extraFilters}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Feather name="grid" size={16} color={colors.primary} />
            <Text style={styles.filterText} numberOfLines={1}>
              {categoryOptions.find((item) => item.value === categoryId)
                ?.label || "Danh mục"}
            </Text>
            <Feather name="chevron-down" size={15} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setPaymentModalVisible(true)}
          >
            <Feather name="credit-card" size={16} color={colors.primary} />
            <Text style={styles.filterText} numberOfLines={1}>
              {paymentOptions.find((item) => item.value === paymentMethod)
                ?.label || "Phương thức"}
            </Text>
            <Feather name="chevron-down" size={15} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterSummary}>
          <Text style={styles.resultText}>
            {filteredTransactions.length} giao dịch phù hợp
          </Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.resetText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải giao dịch...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.messageCard}>
            <Feather name="alert-circle" size={24} color={colors.expense} />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchData()}
            >
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TransactionsList
            items={transactionItems}
            onItemPress={handleOpenDetail}
          />
        )}
      </ScrollView>
      <TransactionFilterModal
        visible={periodModalVisible}
        title="Chọn thời gian"
        options={periodOptions}
        selectedValue={period}
        onClose={() => setPeriodModalVisible(false)}
        onSelect={setPeriod}
      />
      <TransactionFilterModal
        visible={categoryModalVisible}
        title="Chọn danh mục"
        options={categoryOptions}
        selectedValue={categoryId}
        onClose={() => setCategoryModalVisible(false)}
        onSelect={setCategoryId}
      />
      <TransactionFilterModal
        visible={paymentModalVisible}
        title="Phương thức thanh toán"
        options={paymentOptions}
        selectedValue={paymentMethod}
        onClose={() => setPaymentModalVisible(false)}
        onSelect={setPaymentMethod}
      />
      <TransactionDetailModal
        visible={detailModalVisible}
        transaction={detail}
        deleting={deleting}
        onClose={() => setDetailModalVisible(false)}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

export default function Transactions() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionsHome">
        {({ navigation }) => (
          <TransactionsHome
            refreshKey={refreshKey}
            onAddPress={() => navigation.navigate("AddTransaction")}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddTransaction">
        {({ navigation }) => (
          <AddTransaction
            onBack={() => navigation.goBack()}
            onSuccess={() => {
              setRefreshKey((value) => value + 1);
              navigation.goBack();
            }}
          />
        )}
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
  extraFilters: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  filterText: {
    flex: 1,
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.sans,
    color: colors.text,
  },
  filterSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
  },
  resetText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.primary,
  },
  loading: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
  },
  messageCard: {
    padding: 24,
    gap: 12,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.expense,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.textInverse,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
  },
});
