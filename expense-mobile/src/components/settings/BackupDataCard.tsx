import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import axiosClient from '../../api/axiosClient';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export default function BackupDataCard() {
  const [exporting, setExporting] = useState(false);
  const exportData = async () => {
    try {
      setExporting(true);
      const response = await axiosClient.get('/transactions');
      const data: any[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.transactions)
          ? response.data.transactions
          : [];
      const headers = ['Ngày', 'Loại', 'Danh mục', 'Số tiền', 'Phương thức', 'Ghi chú'];
      const rows = data.map(item => [
        item.transaction_date,
        item.type,
        item.category?.name || item.category_id || '',
        item.amount,
        item.payment_method,
        item.note
      ]);
      const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
      const directory = FileSystem.cacheDirectory;
      if (!directory) {
        throw new Error('Không tìm thấy thư mục lưu tạm.');
      }
      const uri = `${directory}finflow-transactions-${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: FileSystem.EncodingType.UTF8
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Xuất dữ liệu giao dịch',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        Alert.alert('Không hỗ trợ', 'Thiết bị không hỗ trợ chia sẻ tệp.');
      }
    } catch (error) {
      console.log('Lỗi xuất dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể xuất dữ liệu giao dịch.');
    } finally {
      setExporting(false);
    }
  };
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Dữ liệu</Text>
      <Text style={styles.subtitle}>Xuất giao dịch thành tệp CSV</Text>
      <TouchableOpacity style={styles.action} onPress={exportData} disabled={exporting}>
        <View style={styles.iconBox}>
          <Feather name="download" size={19} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Sao lưu giao dịch</Text>
          <Text style={styles.description}>Xuất và chia sẻ dữ liệu CSV</Text>
        </View>
        {exporting ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Feather name="chevron-right" size={19} color={colors.textMuted} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface
  },
  title: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text
  },
  subtitle: {
    fontSize: fonts.size.sm,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 16
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1
  },
  label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semiBold,
    color: colors.text
  },
  description: {
    marginTop: 3,
    fontSize: fonts.size.xs,
    color: colors.textMuted
  }
});
