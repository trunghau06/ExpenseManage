import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export interface GoalData {
  id?: string | number;
  name?: string;
  target_amount: number;
}

export interface GoalFormData {
  name: string;
  target_amount: number;
}

interface SavingsGoalModalProps {
  visible: boolean;
  onClose: () => void;
  goal?: GoalData | null;
  onSave: (data: GoalFormData) => Promise<void>;
}

export default function SavingsGoalModal({
  visible,
  onClose,
  goal = null,
  onSave,
}: SavingsGoalModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setName(goal?.name || "");
    setAmount(goal ? String(goal.target_amount) : "");
  }, [visible, goal]);

  const validName = name.trim().length > 0;

  const validAmount =
    amount.length > 0 &&
    Number.isSafeInteger(Number(amount)) &&
    Number(amount) > 0;

  const canSave = validName && validAmount && !saving;

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = async () => {
    if (!canSave) return;

    try {
      setSaving(true);

      await onSave({
        name: name.trim(),
        target_amount: Number(amount),
      });

      onClose();
    } catch (err: any) {
      console.log(
        "Lỗi lưu mục tiêu:",
        err.response?.data ?? err
      );

      Alert.alert(
        "Lưu thất bại",
        err.response?.data?.message ||
          "Không thể lưu mục tiêu tiết kiệm."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.savingsModal}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={styles.savingsModal__backdrop}
          activeOpacity={1}
          onPress={handleClose}
          disabled={saving}
        />

        <View style={styles.savingsModal__container}>
          <View style={styles.savingsModal__header}>
            <View style={styles.savingsModal__heading}>
              <Text style={styles.savingsModal__title}>
                {goal ? "Điều chỉnh mục tiêu" : "Thiết lập mục tiêu"}
              </Text>

              <Text style={styles.savingsModal__subtitle}>
                Lập kế hoạch cho mục tiêu tiết kiệm
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              disabled={saving}
            >
              <Feather
                name="x"
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.savingsModal__content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.savingsModal__field}>
              <Text style={styles.savingsModal__label}>
                Tên mục tiêu
              </Text>

              <TextInput
                style={styles.savingsModal__input}
                placeholder="Ví dụ: Mục tiêu 2026"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                editable={!saving}
                maxLength={100}
              />
            </View>

            <View style={styles.savingsModal__field}>
              <Text style={styles.savingsModal__label}>
                Số tiền mục tiêu (VNĐ)
              </Text>

              <TextInput
                style={styles.savingsModal__input}
                placeholder="Nhập số tiền cần tiết kiệm"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={(value) =>
                  setAmount(value.replace(/\D/g, ""))
                }
                editable={!saving}
              />
            </View>
          </ScrollView>

          <View style={styles.savingsModal__footer}>
            <TouchableOpacity
              style={styles.savingsModal__cancel}
              onPress={handleClose}
              disabled={saving}
            >
              <Text style={styles.savingsModal__cancelText}>
                Hủy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.savingsModal__save,
                !canSave && styles.savingsModal__disabled,
              ]}
              disabled={!canSave}
              onPress={handleSave}
            >
              <Text style={styles.savingsModal__saveText}>
                {saving
                  ? "Đang lưu..."
                  : goal
                    ? "Lưu thay đổi"
                    : "Lưu mục tiêu"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  savingsModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.modalOverlaySoft,
  },

  savingsModal__backdrop: {
    flex: 1,
  },

  savingsModal__container: {
    maxHeight: "85%",
    padding: 20,
    gap: 20,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  savingsModal__header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  savingsModal__heading: {
    flex: 1,
    gap: 4,
  },

  savingsModal__title: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  savingsModal__subtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
  },

  savingsModal__content: {
    gap: 20,
    paddingBottom: 8,
  },

  savingsModal__field: {
    gap: 8,
  },

  savingsModal__label: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  savingsModal__input: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    color: colors.text,
  },

  savingsModal__footer: {
    flexDirection: "row",
    gap: 12,
  },

  savingsModal__cancel: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },

  savingsModal__cancelText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  savingsModal__save: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  savingsModal__disabled: {
    opacity: 0.5,
  },

  savingsModal__saveText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },
});