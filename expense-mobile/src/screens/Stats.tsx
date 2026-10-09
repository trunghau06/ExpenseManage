import React, {
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import SectionHeader from '../components/ui/SectionHeader';
import StatHero, {
  StatPeriod,
} from '../components/stats/StatHero';
import StatMetrics from '../components/stats/StatMetrics';
import StatChart from '../components/stats/StatChart';
import TopExpensesCard from '../components/stats/TopExpensesCard';
import FinancialHealthCard from '../components/stats/FinancialHealthCard';

import { colors } from '../theme/colors';

export default function Stats() {
  const [
    period,
    setPeriod,
  ] = useState<StatPeriod>('3M');

  return (
    <SafeAreaView style={styles.stats}>
      <ScrollView
        contentContainerStyle={styles.stats__content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader />
        <StatHero
          period={period}
          onPeriodChange={setPeriod}
        />

        <StatMetrics />
        <StatChart />
        <TopExpensesCard />

        <FinancialHealthCard />
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
    paddingBottom: 24,
    gap: 16,
  },
});