import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosClient from '../../api/axiosClient';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface Props {
  visible: boolean;
  phone: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditProfileModal({ visible, phone, onClose, onSaved }: Props) {
  const [value, setValue] = useState(phone);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (visible) {
      setValue(phone);
    }
  }, [phone, visible]);
  const save = async () => {
    const normalized = value.trim();
    if (!/^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(normalized)) {
      Alert.alert('Số điện thoại không hợp lệ', 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
      return;
    }
    try {
      setSaving(true);
      await axiosClient.patch('/users/me', { phone: normalized });
      onSaved();
      Alert.alert('Thành công', 'Đã cập nhật số điện thoại.');
    } catch (error: any) {
      Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể cập nhật thông tin.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.panel}>
          <View style={styles.heading}>
            <Text style={styles.title}>Chỉnh sửa thông tin</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            keyboardType="phone-pad"
            placeholder="Nhập số điện thoại"
            placeholderTextColor={colors.textMuted}
            maxLength={13}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={save} disabled={saving}>
              {saving ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={styles.saveText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20
  },
  panel: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  title: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.text
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
    fontSize: fonts.size.base,
    color: colors.text
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22
  },
  cancel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    height: 46
  },
  cancelText: {
    color: colors.text,
    fontWeight: fonts.weight.semiBold
  },
  save: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 46
  },
  saveText: {
    color: colors.textInverse,
    fontWeight: fonts.weight.semiBold
  }
});
