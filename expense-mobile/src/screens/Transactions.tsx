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
import TransactionsHero from '../components/transactions/TransactionsHero';
import TransactionsMetrics from '../components/transactions/TransactionsMetrics';
import TransactionsFilter, {
  TransactionFilterType,
} from '../components/transactions/TransactionsFilter';
import TransactionsList from '../components/transactions/TransactionsList';

import { colors } from '../theme/colors';

export default function Transactions() {
  const [
    search,
    setSearch,
  ] = useState('');

  const [
    type,
    setType,
  ] = useState<TransactionFilterType>('ALL');

  return (
    <SafeAreaView style={styles.transactions}>
      <ScrollView
        contentContainerStyle={styles.transactions__content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader />
        <TransactionsHero />
        <TransactionsMetrics />

        <TransactionsFilter
          search={search}
          type={type}
          onSearchChange={setSearch}
          onTypeChange={setType}
        />

        <TransactionsList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  transactions: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  transactions__content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
});