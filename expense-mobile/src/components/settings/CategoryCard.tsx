import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosClient from '../../api/axiosClient';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export interface SettingCategory {
  id: string;
  name: string;
  type?: 'INCOME' | 'EXPENSE';
  icon?: string;
}

interface Props {
  categories?: SettingCategory[];
  onChanged?: () => void;
}

const icons = ['utensils', 'car', 'home', 'shopping-cart', 'coffee', 'book', 'heart', 'briefcase', 'dollar-sign', 'gift', 'tag'] as const;
type IconName = typeof icons[number];

export default function CategoryCard({ categories = [], onChanged }: Props) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<IconName>('tag');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const filtered = categories.filter(item => item.type === type);
  const create = async () => {
    if (!name.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên danh mục.');
      return;
    }
    try {
      setSaving(true);
      await axiosClient.post('/categories', {
        name: name.trim(),
        type,
        icon
      });
      setVisible(false);
      setName('');
      onChanged?.();
    } catch (error: any) {
      Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể thêm danh mục.');
    } finally {
      setSaving(false);
    }
  };
  const remove = (item: SettingCategory) => {
    Alert.alert('Xóa danh mục', `Bạn có chắc muốn xóa "${item.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(item.id);
            await axiosClient.delete(`/categories/${item.id}`);
            onChanged?.();
          } catch (error: any) {
            Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể xóa danh mục.');
          } finally {
            setDeleting(null);
          }
        }
      }
    ]);
  };
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>Quản lý danh mục</Text>
          <Text style={styles.subtitle}>Danh mục thu nhập và chi tiêu</Text>
        </View>
        <TouchableOpacity style={styles.add} onPress={() => setVisible(true)}>
          <Feather name="plus" size={19} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {(['EXPENSE', 'INCOME'] as const).map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, type === item && styles.tabActive]}
            onPress={() => setType(item)}
          >
            <Text style={[styles.tabText, type === item && styles.tabTextActive]}>
              {item === 'EXPENSE' ? 'Chi tiêu' : 'Thu nhập'} ({categories.filter(c => c.type === item).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {filtered.length === 0 ? (
        <Text style={styles.empty}>Chưa có danh mục</Text>
      ) : (
        filtered.map(item => (
          <View style={styles.item} key={item.id}>
            <View style={styles.iconBox}>
              <Feather name="tag" size={17} color={colors.primary} />
            </View>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => remove(item)} disabled={deleting === item.id}>
              {deleting === item.id ? (
                <ActivityIndicator color={colors.expense} />
              ) : (
                <Feather name="trash-2" size={18} color={colors.expense} />
              )}
            </TouchableOpacity>
          </View>
        ))
      )}
      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.panel}>
            <View style={styles.header}>
              <Text style={styles.title}>Thêm danh mục {type === 'INCOME' ? 'thu' : 'chi'}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Feather name="x" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Tên danh mục</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Nhập tên danh mục"
              placeholderTextColor={colors.textMuted}
              maxLength={80}
            />
            <Text style={styles.label}>Biểu tượng</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
              {icons.map(value => (
                <TouchableOpacity
                  key={value}
                  style={[styles.iconChoice, icon === value && styles.iconChoiceActive]}
                  onPress={() => setIcon(value)}
                >
                  <Feather name={value} size={19} color={icon === value ? colors.textInverse : colors.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.submit} onPress={create} disabled={saving}>
              {saving ? <ActivityIndicator color={colors.textInverse} /> : <Text style={styles.submitText}>Thêm danh mục</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  heading: {
    flex: 1
  },
  title: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text
  },
  subtitle: {
    marginTop: 4,
    fontSize: fonts.size.sm,
    color: colors.textMuted
  },
  add: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.bg
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: colors.bg
  },
  tabActive: {
    backgroundColor: colors.primary
  },
  tabText: {
    color: colors.text,
    fontSize: fonts.size.sm
  },
  tabTextActive: {
    color: colors.textInverse,
    fontWeight: fonts.weight.semiBold
  },
  empty: {
    paddingVertical: 18,
    textAlign: 'center',
    color: colors.textMuted
  },
  item: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    flex: 1,
    fontSize: fonts.size.sm,
    color: colors.text
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20
  },
  label: {
    fontSize: fonts.size.sm,
    color: colors.text,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 18,
    color: colors.text
  },
  iconScroll: {
    marginBottom: 20
  },
  iconChoice: {
    width: 44,
    height: 44,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconChoiceActive: {
    backgroundColor: colors.primary
  },
  submit: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: {
    fontWeight: fonts.weight.semiBold,
    color: colors.textInverse
  }
});
