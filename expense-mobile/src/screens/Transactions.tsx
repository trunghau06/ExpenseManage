import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../theme/colors";

import SectionHeader from "../components/ui/SectionHeader";
import TransactionsHero from "../components/transactions/TransactionsHero";
import TransactionsMetrics from "../components/transactions/TransactionsMetrics";
import TransactionsFilter, {
  TransactionFilterType,
} from "../components/transactions/TransactionsFilter";
import TransactionsList from "../components/transactions/TransactionsList";
import AddTransaction from "./AddTransaction";

type TransactionsStackParamList = {
  TransactionsHome: undefined;
  AddTransaction: undefined;
};

interface TransactionsHomeProps {
  onAddPress: () => void;
  refreshKey: number;
}

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

function TransactionsHome({ onAddPress, refreshKey }: TransactionsHomeProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionFilterType>("ALL");

  return (
    <SafeAreaView style={styles.transactions}>
      <ScrollView
        contentContainerStyle={styles.transactions__content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader />
        <TransactionsHero onAddPress={onAddPress} />
        <TransactionsMetrics key={`metrics-${refreshKey}`} />
        <TransactionsFilter
          search={search}
          type={type}
          onSearchChange={setSearch}
          onTypeChange={setType}
        />
        <TransactionsList key={`list-${refreshKey}`} />
        
      </ScrollView>
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
              setRefreshKey((prev) => prev + 1);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
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
