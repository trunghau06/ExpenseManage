import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export interface TransactionDetail {
  id: string | number;
  type: "INCOME" | "EXPENSE";
  amount: string | number;
  categoryName: string;
  date: string;
  paymentMethod: string;
  note: string;
}

interface Props {
  visible: boolean;
  transaction: TransactionDetail | null;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function TransactionDetailModal({ visible, transaction, deleting, onClose, onDelete }: Props) {
  const amount = Number(transaction?.amount || 0);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Chi tiết giao dịch</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          {transaction && (
            <>
              <View style={styles.amountBox}>
                <Text style={styles.label}>Số tiền giao dịch</Text>
                <Text style={[styles.amount, { color: transaction.type === "INCOME" ? colors.income : colors.expense }]}>
                  {transaction.type === "INCOME" ? "+" : "-"}{amount.toLocaleString("vi-VN")} đ
                </Text>
                <Text style={styles.label}>{transaction.type === "INCOME" ? "Khoản thu" : "Khoản chi"}</Text>
              </View>
              <DetailRow label="Danh mục" value={transaction.categoryName} />
              <DetailRow label="Ngày giao dịch" value={transaction.date} />
              <DetailRow label="Phương thức" value={transaction.paymentMethod} />
              <DetailRow label="Ghi chú" value={transaction.note || "Không có"} />
              <View style={styles.actions}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeText}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete} disabled={deleting}>
                  {deleting ? <ActivityIndicator color={colors.expense} /> : (
                    <>
                      <Feather name="trash-2" size={17} color={colors.expense} />
                      <Text style={styles.deleteText}>Xóa giao dịch</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.45)"
  },
  container: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  title: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.text
  },
  amountBox: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    marginBottom: 12,
    backgroundColor: colors.bg,
    borderRadius: 12
  },
  amount: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  label: {
    fontSize: fonts.size.sm,
    color: colors.textMuted
  },
  value: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    textAlign: "right"
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24
  },
  closeButton: {
    flex: 1,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10
  },
  closeText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text
  },
  deleteButton: {
    flex: 1,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.expense,
    borderRadius: 10
  },
  deleteText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.expense
  }
});
