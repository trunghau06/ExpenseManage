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

export interface BudgetCategory {
  id: string | number;
  name: string;
}

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  categories: BudgetCategory[];
  month: number;
  year: number;
  initialBudget?: {
    categoryId: string | number;
    amount: number;
  } | null;
  onSave: (
    categoryId: string | number,
    amount: number
  ) => Promise<void>;
}

export default function BudgetModal({
  visible,
  onClose,
  categories,
  month,
  year,
  initialBudget = null,
  onSave,
}: BudgetModalProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<BudgetCategory | null>(null);

  const [showCategories, setShowCategories] = useState(false);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const validAmount = Number(amount) > 0;
  const canSave = selectedCategory !== null && validAmount;

  const handleClose = () => {
    setSelectedCategory(null);
    setShowCategories(false);
    setAmount("");
    onClose();
  };

  const handleSave = async () => {
    if (!selectedCategory || !validAmount || saving) return;

    try {
      setSaving(true);

      await onSave(selectedCategory.id, Number(amount));

      handleClose();
    } catch (err: any) {
      Alert.alert(
        "Lưu thất bại",
        err.response?.data?.message || "Không thể lưu ngân sách."
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!visible) return;

    if (initialBudget) {
      const category = categories.find(
        (item) =>
          String(item.id) === String(initialBudget.categoryId)
      );

      setSelectedCategory(category ?? null);
      setAmount(String(initialBudget.amount));
    } else {
      setSelectedCategory(null);
      setAmount("");
    }

    setShowCategories(false);
  }, [visible, initialBudget, categories]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.budgetModal}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={styles.budgetModal__backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.budgetModal__container}>
          <View style={styles.budgetModal__header}>
            <View style={styles.budgetModal__heading}>
              <Text style={styles.budgetModal__title}>
                {initialBudget
                  ? "Chỉnh sửa ngân sách"
                  : "Thiết lập ngân sách"}
              </Text>

              <Text style={styles.budgetModal__subtitle}>
                Quản lý hạn mức chi tiêu theo danh mục
              </Text>
            </View>

            <TouchableOpacity onPress={handleClose}>
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.budgetModal__content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.budgetModal__field}>
              <Text style={styles.budgetModal__label}>Danh mục chi tiêu</Text>

              <TouchableOpacity
                style={styles.budgetModal__select}
                disabled={!!initialBudget}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Text
                  style={[
                    styles.budgetModal__selectText,
                    !selectedCategory && styles.budgetModal__placeholder,
                  ]}
                >
                  {selectedCategory?.name || "Chọn danh mục"}
                </Text>

                <Feather
                  name={showCategories ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {showCategories && (
                <View style={styles.budgetModal__categoryList}>
                  {categories.length === 0 ? (
                    <Text style={styles.budgetModal__emptyText}>
                      Chưa có danh mục chi tiêu
                    </Text>
                  ) : (
                    categories.map((item) => (
                      <TouchableOpacity
                        key={String(item.id)}
                        style={styles.budgetModal__categoryItem}
                        onPress={() => {
                          setSelectedCategory(item);
                          setShowCategories(false);
                        }}
                      >
                        <Text style={styles.budgetModal__selectText}>
                          {item.name}
                        </Text>

                        {selectedCategory?.id === item.id && (
                          <Feather
                            name="check"
                            size={18}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>

            <View style={styles.budgetModal__field}>
              <Text style={styles.budgetModal__label}>
                Hạn mức ngân sách (VNĐ)
              </Text>

              <TextInput
                style={styles.budgetModal__input}
                placeholder="Nhập số tiền"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={(value) => setAmount(value.replace(/\D/g, ""))}
              />
            </View>

            <View style={styles.budgetModal__field}>
              <Text style={styles.budgetModal__label}>Tháng áp dụng</Text>

              <View style={styles.budgetModal__month}>
                <Feather name="calendar" size={20} color={colors.primary} />

                <Text style={styles.budgetModal__monthText}>
                  Tháng {month}/{year}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.budgetModal__footer}>
            <TouchableOpacity
              style={styles.budgetModal__cancel}
              onPress={handleClose}
            >
              <Text style={styles.budgetModal__cancelText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.budgetModal__save,
                (!canSave || saving) && styles.budgetModal__saveDisabled,
              ]}
              disabled={!canSave || saving}
              onPress={handleSave}
            >
              <Text style={styles.budgetModal__saveText}>
                {saving
                  ? "Đang lưu..."
                  : initialBudget
                    ? "Lưu thay đổi"
                    : "Lưu ngân sách"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  budgetModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.modalOverlaySoft,
  },

  budgetModal__backdrop: {
    flex: 1,
  },

  budgetModal__container: {
    maxHeight: "85%",
    padding: 20,
    gap: 20,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  budgetModal__header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  budgetModal__heading: {
    flex: 1,
    gap: 4,
  },

  budgetModal__title: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  budgetModal__subtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
  },

  budgetModal__content: {
    gap: 20,
    paddingBottom: 8,
  },

  budgetModal__field: {
    gap: 8,
  },

  budgetModal__label: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  budgetModal__select: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },

  budgetModal__selectText: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    color: colors.text,
  },

  budgetModal__placeholder: {
    color: colors.textMuted,
  },

  budgetModal__categoryList: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },

  budgetModal__categoryItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  budgetModal__emptyText: {
    padding: 16,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
    textAlign: "center",
  },

  budgetModal__input: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    color: colors.text,
  },

  budgetModal__month: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },

  budgetModal__monthText: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    color: colors.text,
  },

  budgetModal__footer: {
    flexDirection: "row",
    gap: 12,
  },

  budgetModal__cancel: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },

  budgetModal__cancelText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  budgetModal__save: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  budgetModal__saveDisabled: {
    opacity: 0.5,
  },

  budgetModal__saveText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },
});
