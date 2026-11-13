import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import axiosClient from '../api/axiosClient';
import SectionHeader from '../components/ui/SectionHeader';
import StatHero, { StatPeriod } from '../components/stats/StatHero';
import StatMetrics from '../components/stats/StatMetrics';
import StatChart, { StatChartItem } from '../components/stats/StatChart';
import TopExpensesCard, { TopExpenseItem } from '../components/stats/TopExpensesCard';
import FinancialHealthCard from '../components/stats/FinancialHealthCard';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface MetricsResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingRate: number;
  canCalculateSavingRate: boolean;
  periodLabel: string;
}

interface ChartResponseItem {
  month: string;
  monthNumber: number;
  year: number;
  income: number;
  expense: number;
}

interface TopExpenseResponseItem {
  id: string | number;
  title: string;
  amount: string;
  percent: number;
}

interface TopExpensesResponse {
  items: TopExpenseResponseItem[];
}

const periodParams: Record<StatPeriod, string> = {
  '3M': '3',
  '6M': '6',
  '1Y': 'year',
};

const formatMoney = (value: number) =>
  `${Number(value || 0).toLocaleString('vi-VN')} đ`;

export default function Stats() {
  const [period, setPeriod] = useState<StatPeriod>('6M');
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [chartItems, setChartItems] = useState<StatChartItem[]>([]);
  const [topItems, setTopItems] = useState<TopExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError('');

    try {
      const query = `period=${periodParams[period]}`;
      const [metricsResponse, chartResponse, topResponse] = await Promise.all([
        axiosClient.get<MetricsResponse>(`/stats/metrics?${query}`),
        axiosClient.get<ChartResponseItem[]>(`/stats/chart-flow?${query}`),
        axiosClient.get<TopExpensesResponse>(`/stats/top-expenses?${query}`),
      ]);

      setMetrics(metricsResponse.data);
      setChartItems(
        (Array.isArray(chartResponse.data) ? chartResponse.data : []).map(
          (item) => ({
            id: `${item.year}-${item.monthNumber}`,
            label: item.month,
            income: Number(item.income) || 0,
            expense: Number(item.expense) || 0,
          })
        )
      );
      setTopItems(
        (Array.isArray(topResponse.data?.items) ? topResponse.data.items : []).map(
          (item) => ({
            id: String(item.id),
            name: item.title,
            amount: item.amount,
            percent: Number(item.percent) || 0,
          })
        )
      );
    } catch (requestError) {
      console.error('Lỗi tải thống kê:', requestError);
      setMetrics(null);
      setChartItems([]);
      setTopItems([]);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats(false);
  };

  const savingStatus = !metrics?.canCalculateSavingRate
    ? null
    : metrics.savingRate >= 20
      ? 'Tiết kiệm tốt'
      : metrics.savingRate > 0
        ? 'Có khoản tiết kiệm'
        : 'Chưa có khoản tiết kiệm';

  return (
    <SafeAreaView style={styles.stats}>
      <ScrollView
        contentContainerStyle={styles.stats__content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <SectionHeader />
        <StatHero
          period={period}
          onPeriodChange={setPeriod}
          subtitle={metrics?.periodLabel}
        />
        {loading ? (
          <View style={styles.stats__loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stats__hint}>Đang tải thống kê...</Text>
          </View>
        ) : error ? (
          <View style={styles.stats__error}>
            <Feather name="alert-circle" size={26} color={colors.expense} />
            <Text style={styles.stats__errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.stats__retry}
              onPress={() => fetchStats()}
            >
              <Text style={styles.stats__retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <StatMetrics
              income={metrics ? formatMoney(metrics.totalIncome) : undefined}
              expense={metrics ? formatMoney(metrics.totalExpense) : undefined}
              balance={metrics ? formatMoney(metrics.balance) : undefined}
            />
            <StatChart items={chartItems} />
            <TopExpensesCard items={topItems} />
            <FinancialHealthCard
              savingRate={metrics?.canCalculateSavingRate ? metrics.savingRate : null}
              status={savingStatus}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stats: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  stats__content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 16,
  },
  stats__loading: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stats__hint: {
    color: colors.textMuted,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
  },
  stats__error: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    gap: 14,
    alignItems: 'center',
  },
  stats__errorText: {
    color: colors.expense,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    textAlign: 'center',
  },
  stats__retry: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  stats__retryText: {
    color: colors.textInverse,
    fontWeight: fonts.weight.semiBold,
  },
});
