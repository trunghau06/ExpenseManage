import React from "react";
import { StyleSheet, Text, View } from "react-native";
import EmptyState from "../ui/EmptyState";
import SectionCard from "../ui/SectionCard";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

interface SavingsGoalCardProps {
  name?: string | null;
  current?: string | null;
  target?: string | null;
  progress?: number | null;
  onViewAll?: () => void;
}

export default function SavingsGoalCard({
  name,
  current,
  target,
  progress,
  onViewAll
}: SavingsGoalCardProps) {
  if (!name || !current || !target || progress == null) {
    return (
      <SectionCard
        title="Mục tiêu tiết kiệm"
        rightText="Xem tất cả"
        onRightPress={onViewAll}
      >
        <EmptyState text="Chưa có mục tiêu tiết kiệm" />
      </SectionCard>
    );
  }

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <SectionCard
      title="Mục tiêu tiết kiệm"
      rightText="Xem tất cả"
      onRightPress={onViewAll}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.percent}>{safeProgress}%</Text>
      </View>
      <View style={styles.values}>
        <Text style={styles.current}>{current}</Text>
        <Text style={styles.target}>/ {target}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            { width: `${safeProgress}%` as `${number}%` }
          ]}
        />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  name: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text
  },
  percent: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.medium,
    color: colors.primary
  },
  values: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4
  },
  current: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.bold,
    color: colors.text
  },
  target: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted
  },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: "hidden"
  },
  progress: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8
  }
});