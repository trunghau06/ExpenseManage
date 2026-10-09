import React, {
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

import SectionHeader from '../components/ui/SectionHeader';
import BalanceSummaryCard from '../components/dashboard/BalanceSummaryCard';
import PeriodTabs, {
  DashboardPeriod,
} from '../components/dashboard/PeriodTabs';
import QuickActions from '../components/dashboard/QuickActions';
import ExpenseAllocationCard from '../components/dashboard/ExpenseAllocationCard';
import BudgetSummaryCard from '../components/dashboard/BudgetSummaryCard';
import SavingsGoalCard from '../components/dashboard/SavingsGoalCard';
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard';

export default function Dashboard() {
  const [
    period,
    setPeriod,
  ] = useState<DashboardPeriod>('current');

  const periodLabel =
    period === 'current'
      ? 'Tháng này'
      : 'Tháng trước';

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
            Thứ 6, ngày 9 tháng 10
          </Text>
        </View>

        <BalanceSummaryCard />
        <PeriodTabs
          value={period}
          onChange={setPeriod}
        />

        <QuickActions />
        <ExpenseAllocationCard
          periodLabel={periodLabel}
        />

        <BudgetSummaryCard />
        <SavingsGoalCard />
        <RecentTransactionsCard />
        
      </ScrollView>
    </SafeAreaView>
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
    gap: 0,
  },

  dashboard__greetingTitle: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    marginBottom: 0
  },

  dashboard__greetingSubtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },
});