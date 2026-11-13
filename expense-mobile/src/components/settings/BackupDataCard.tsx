
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import axiosClient from '../../api/axiosClient';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

type Transaction = {
  transaction_date?: string;
  date?: string;
  type?: string;
  category?: { name?: string };
  category_name?: string;
  category_id?: string;
  amount?: number | string;
  payment_method?: string;
  note?: string | null;
};

const csvCell = (value: unknown) => {
  const text = String(value ?? '');
  const safeText = /^[\s]*[=+@]/.test(text) || /^[\s]*-\D/.test(text)
    ? `'${text}`
    : text;
  return `"${safeText.replace(/"/g, '""')}"`;
};

export default function BackupDataCard() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [visible, setVisible] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [exporting, setExporting] = useState(false);

  const years = Array.from(
    { length: 11 },
    (_, index) => now.getFullYear() - index
  );

  const closeModal = () => {
    if (exporting) return;
    setVisible(false);
    setShowMonths(false);
    setShowYears(false);
  };

  const exportData = async () => {
    if (exporting) return;

    try {
      setExporting(true);

      const response = await axiosClient.get('/transactions', {
        params: { month, year },
      });

      const payload = response.data;
      const data: Transaction[] | null = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.transactions)
          ? payload.transactions
          : Array.isArray(payload?.data)
            ? payload.data
            : null;

      if (!data) {
        throw new Error('Dữ liệu giao dịch không hợp lệ.');
      }

      if (data.length === 0) {
        Alert.alert(
          'Không có dữ liệu',
          `Không có giao dịch trong tháng ${month}/${year}.`
        );
        return;
      }

      const headers = [
        'Ngày',
        'Loại giao dịch',
        'Danh mục',
        'Số tiền',
        'Phương thức thanh toán',
        'Ghi chú',
      ];

      const rows = data.map((item) => [
        item.transaction_date ?? item.date ?? '',
        item.type === 'INCOME'
          ? 'Thu nhập'
          : item.type === 'EXPENSE'
            ? 'Chi tiêu'
            : item.type ?? '',
        item.category?.name ??
          item.category_name ??
          item.category_id ??
          '',
        item.amount ?? 0,
        item.payment_method ?? '',
        item.note ?? '',
      ]);

      const title = `BÁO CÁO GIAO DỊCH THÁNG ${month}/${year}`;

      const csv =
        '\uFEFF' +
        [[title], [], headers, ...rows]
          .map((row) => row.map(csvCell).join(','))
          .join('\r\n');

      const directory = FileSystem.cacheDirectory;

      if (!directory) {
        throw new Error('Không tìm thấy thư mục lưu tạm.');
      }

      const fileName =
        `FinFlow_${year}_${String(month).padStart(2, '0')}.csv`;
      const uri = `${directory}${fileName}`;

      await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          'Không hỗ trợ',
          'Thiết bị không hỗ trợ chia sẻ tệp.'
        );
        return;
      }

      closeModalAfterExport();
      await Sharing.shareAsync(uri, {
        mimeType: 'text/csv',
        dialogTitle: 'Xuất dữ liệu giao dịch',
        UTI: 'public.comma-separated-values-text',
      });
    } catch (error) {
      console.log('Lỗi xuất dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể xuất dữ liệu giao dịch.');
    } finally {
      setExporting(false);
    }
  };

  const closeModalAfterExport = () => {
    setVisible(false);
    setShowMonths(false);
    setShowYears(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Dữ liệu</Text>
      <Text style={styles.subtitle}>
        Xuất giao dịch thành tệp CSV
      </Text>

      <TouchableOpacity
        style={styles.action}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <View style={styles.iconBox}>
          <Feather name="download" size={19} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Sao lưu giao dịch</Text>
          <Text style={styles.description}>
            Xuất và chia sẻ dữ liệu CSV theo tháng
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={19}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />

          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Feather
                  name="file-text"
                  size={23}
                  color={colors.primary}
                />
              </View>

              <View style={styles.modalHeading}>
                <Text style={styles.modalTitle}>
                  Xuất dữ liệu tài chính
                </Text>
                <Text style={styles.modalSubtitle}>
                  Chọn tháng và năm cần sao lưu
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeModal}
                disabled={exporting}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Tháng</Text>
                <TouchableOpacity
                  style={styles.select}
                  disabled={exporting}
                  onPress={() => {
                    setShowMonths(!showMonths);
                    setShowYears(false);
                  }}
                >
                  <Text style={styles.selectText}>Tháng {month}</Text>
                  <Feather
                    name="chevron-down"
                    size={17}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Năm</Text>
                <TouchableOpacity
                  style={styles.select}
                  disabled={exporting}
                  onPress={() => {
                    setShowYears(!showYears);
                    setShowMonths(false);
                  }}
                >
                  <Text style={styles.selectText}>{year}</Text>
                  <Feather
                    name="chevron-down"
                    size={17}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {(showMonths || showYears) && (
              <ScrollView
                style={styles.options}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {(showMonths
                  ? Array.from({ length: 12 }, (_, i) => i + 1)
                  : years
                ).map((value) => {
                  const selected = showMonths
                    ? value === month
                    : value === year;

                  return (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.option,
                        selected && styles.optionSelected,
                      ]}
                      onPress={() => {
                        if (showMonths) setMonth(value);
                        else setYear(value);
                        setShowMonths(false);
                        setShowYears(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {showMonths ? `Tháng ${value}` : value}
                      </Text>
                      {selected && (
                        <Feather
                          name="check"
                          size={17}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.notice}>
              <Feather
                name="info"
                size={17}
                color={colors.primary}
              />
              <Text style={styles.noticeText}>
                Báo cáo tháng {month}/{year} sẽ được xuất thành
                file CSV có thể mở bằng Excel.
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                disabled={exporting}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.exportButton,
                  exporting && styles.disabled,
                ]}
                onPress={exportData}
                disabled={exporting}
              >
                {exporting ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Feather
                    name="download"
                    size={17}
                    color={colors.surface}
                  />
                )}
                <Text style={styles.exportText}>
                  {exporting ? 'Đang xuất...' : 'Xuất CSV'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  label: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.sans,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
  },
  description: {
    marginTop: 3,
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.sans,
    color: colors.textMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  modalIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#E1ECFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeading: { flex: 1 },
  modalTitle: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.bold,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: fonts.size.xs,
    color: colors.textMuted,
    marginTop: 4,
  },
  closeButton: { padding: 4 },
  fields: {
    flexDirection: 'row',
    gap: 12,
  },
  field: { flex: 1 },
  fieldLabel: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 8,
  },
  select: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    backgroundColor: colors.bg,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: fonts.size.sm,
    color: colors.text,
    fontWeight: fonts.weight.semiBold,
  },
  options: {
    maxHeight: 185,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 10,
  },
  option: {
    minHeight: 42,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: { backgroundColor: '#EFF6FF' },
  optionText: {
    fontSize: fonts.size.sm,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: fonts.weight.semiBold,
  },
  notice: {
    flexDirection: 'row',
    gap: 10,
    padding: 13,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    marginTop: 20,
    alignItems: 'flex-start',
  },
  noticeText: {
    flex: 1,
    color: colors.primary,
    fontSize: fonts.size.xs,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
  },
  exportButton: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportText: {
    color: colors.surface,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
  },
  disabled: { opacity: 0.6 },
});
