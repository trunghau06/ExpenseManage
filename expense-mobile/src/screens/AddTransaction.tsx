import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

import axiosClient from "../api/axiosClient";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

interface AddTransactionProps {
  onBack: () => void;
  onSuccess: () => void;
}

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
}

type TransactionType = "INCOME" | "EXPENSE";
type PaymentMethod = "CASH" | "BANK_TRANSFER";

const transactionTypes = [
  { value: "EXPENSE", label: "Khoản Chi", icon: "arrow-down-circle" },
  { value: "INCOME", label: "Khoản Thu", icon: "arrow-up-circle" },
] as const;

export default function AddTransaction({
  onBack,
  onSuccess,
}: AddTransactionProps) {
  const scrollRef = useRef<ScrollView>(null);

  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isIOS = Platform.OS === "ios";

  const filteredCategories = categories.filter(
    (item) => item.type?.toUpperCase() === type,
  );

  const selectedCategory = filteredCategories.find(
    (item) => item.id === categoryId,
  );

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.categories;

        if (active) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.log("Lỗi lấy danh mục:", err);

        if (active) {
          setError("Không thể tải danh mục.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (!selectedCategory) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    try {
      setSaving(true);

      const selectedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12,
      );

      await axiosClient.post("/transactions", {
        type,
        amount: Number(amount),
        category_id: categoryId,
        payment_method: paymentMethod,
        transaction_date: selectedDate.toISOString(),
        note: note.trim(),
      });

      onSuccess();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;

      setError(message || "Thêm giao dịch thất bại.");
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.addTransaction}>
      <KeyboardAvoidingView
        style={styles.addTransaction__body}
        behavior={isIOS ? "padding" : "height"}
      >
        <View style={styles.addTransaction__header}>
          <TouchableOpacity onPress={onBack} disabled={saving}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>

          <View>
            <Text style={styles.addTransaction__title}>Thêm giao dịch</Text>
            <Text style={styles.addTransaction__subtitle}>
              Ghi lại khoản thu và chi tiêu
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.addTransaction__content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <Text style={styles.addTransaction__error}>{error}</Text>
          ) : null}

          <View style={styles.addTransaction__tabs}>
            {transactionTypes.map((item) => {
              const active = type === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.addTransaction__tab,
                    active && styles.addTransaction__tabActive,
                  ]}
                  onPress={() => {
                    setType(item.value);
                    setCategoryId("");
                    setShowCategories(false);
                  }}
                >
                  <Feather
                    name={item.icon}
                    size={20}
                    color={active ? colors.textInverse : colors.textMuted}
                  />

                  <Text
                    style={[
                      styles.addTransaction__tabText,
                      active && styles.addTransaction__tabTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.addTransaction__field}>
            <Text style={styles.addTransaction__label}>Số tiền (VNĐ)</Text>

            <View style={styles.addTransaction__inputBox}>
              <MaterialCommunityIcons
                name="cash"
                size={22}
                color={colors.textMuted}
              />

              <TextInput
                style={styles.addTransaction__input}
                placeholder="Nhập số tiền"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={(value) => setAmount(value.replace(/\D/g, ""))}
              />
            </View>
          </View>

          <View style={styles.addTransaction__field}>
            <Text style={styles.addTransaction__label}>Danh mục</Text>

            <TouchableOpacity
              style={styles.addTransaction__inputBox}
              disabled={loading || filteredCategories.length === 0}
              onPress={() => {
                Keyboard.dismiss();
                setShowCategories(!showCategories);
              }}
            >
              <Feather name="grid" size={20} color={colors.textMuted} />

              <Text style={styles.addTransaction__placeholder}>
                {loading
                  ? "Đang tải danh mục..."
                  : selectedCategory?.name ||
                    (filteredCategories.length === 0
                      ? "Chưa có dữ liệu"
                      : "Chọn danh mục")}
              </Text>

              <Feather name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {showCategories && (
              <View style={styles.addTransaction__categoryList}>
                {filteredCategories.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.addTransaction__categoryItem}
                    onPress={() => {
                      setCategoryId(item.id);
                      setShowCategories(false);
                    }}
                  >
                    <Text style={styles.addTransaction__categoryText}>
                      {item.name}
                    </Text>

                    {categoryId === item.id && (
                      <Feather name="check" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.addTransaction__field}>
            <Text style={styles.addTransaction__label}>
              Phương thức thanh toán
            </Text>

            <View style={styles.addTransaction__payments}>
              <TouchableOpacity
                style={[
                  styles.addTransaction__payment,
                  paymentMethod === "CASH" &&
                    styles.addTransaction__paymentActive,
                ]}
                onPress={() => setPaymentMethod("CASH")}
              >
                <MaterialCommunityIcons
                  name="cash"
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.addTransaction__paymentText}>Tiền mặt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addTransaction__payment,
                  paymentMethod === "BANK_TRANSFER" &&
                    styles.addTransaction__paymentActive,
                ]}
                onPress={() => setPaymentMethod("BANK_TRANSFER")}
              >
                <Feather name="credit-card" size={20} color={colors.primary} />
                <Text style={styles.addTransaction__paymentText}>
                  Chuyển khoản
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.addTransaction__field}>
            <Text style={styles.addTransaction__label}>Ngày giao dịch</Text>

            <TouchableOpacity
              style={styles.addTransaction__inputBox}
              onPress={() => {
                Keyboard.dismiss();
                setShowDatePicker(true);
              }}
            >
              <Feather name="calendar" size={20} color={colors.textMuted} />

              <Text style={styles.addTransaction__placeholder}>
                {date.toLocaleDateString("vi-VN")}
              </Text>

              <Feather name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {showDatePicker && (
              <>
                <DateTimePicker
                  value={date}
                  mode="date"
                  onValueChange={(_, selectedDate) => {
                    setDate(selectedDate);

                    if (!isIOS) {
                      setShowDatePicker(false);
                    }
                  }}
                  onDismiss={() => setShowDatePicker(false)}
                />

                {isIOS ? (
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.addTransaction__dateDone}>Xong</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
          </View>

          <View style={styles.addTransaction__field}>
            <Text style={styles.addTransaction__label}>Ghi chú</Text>

            <TextInput
              style={styles.addTransaction__note}
              placeholder="Nhập ghi chú cho giao dịch..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              value={note}
              onChangeText={setNote}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
          </View>

          <View style={styles.addTransaction__footer}>
            <TouchableOpacity
              style={styles.addTransaction__cancel}
              onPress={onBack}
              disabled={saving}
            >
              <Text style={styles.addTransaction__cancelText}>Hủy bỏ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addTransaction__submit,
                (saving || loading) && styles.addTransaction__submitDisabled,
              ]}
              onPress={handleSubmit}
              disabled={saving || loading}
            >
              {saving ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <>
                  <Text style={styles.addTransaction__submitText}>
                    Lưu giao dịch
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addTransaction: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  addTransaction__body: {
    flex: 1,
  },

  addTransaction__header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  addTransaction__title: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },

  addTransaction__subtitle: {
    fontSize: fonts.size.xs,
    color: colors.textMuted,
  },

  addTransaction__content: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },

  addTransaction__error: {
    fontSize: fonts.size.sm,
    color: colors.expense,
  },

  addTransaction__tabs: {
    flexDirection: "row",
    gap: 8,
  },

  addTransaction__tab: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  addTransaction__tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  addTransaction__tabText: {
    fontSize: fonts.size.sm,
    color: colors.textMuted,
  },

  addTransaction__tabTextActive: {
    color: colors.textInverse,
    fontWeight: fonts.weight.semiBold,
  },

  addTransaction__field: {
    gap: 8,
  },

  addTransaction__label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },

  addTransaction__inputBox: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  addTransaction__input: {
    flex: 1,
    fontSize: fonts.size.base,
    color: colors.text,
  },

  addTransaction__placeholder: {
    flex: 1,
    fontSize: fonts.size.sm,
    color: colors.textMuted,
  },

  addTransaction__categoryList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  addTransaction__categoryItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  addTransaction__categoryText: {
    fontSize: fonts.size.sm,
    color: colors.text,
  },

  addTransaction__payments: {
    flexDirection: "row",
    gap: 12,
  },

  addTransaction__payment: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  addTransaction__paymentActive: {
    borderColor: colors.primary,
    backgroundColor: colors.bg,
  },

  addTransaction__paymentText: {
    fontSize: fonts.size.xs,
    color: colors.text,
  },

  addTransaction__dateDone: {
    alignSelf: "flex-end",
    color: colors.primary,
    fontSize: fonts.size.sm,
  },

  addTransaction__note: {
    minHeight: 96,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    fontSize: fonts.size.sm,
    color: colors.text,
  },

  addTransaction__footer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },

  addTransaction__cancel: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  addTransaction__cancelText: {
    color: colors.text,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
  },

  addTransaction__submit: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },

  addTransaction__submitDisabled: {
    opacity: 0.6,
  },

  addTransaction__submitText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse,
  },
});
