import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

export default function TransactionFilterModal({ visible, title, options, selectedValue, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {options.map(option => {
              const selected = option.value === selectedValue;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.option, selected && styles.optionActive]}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>{option.label}</Text>
                  {selected && <Feather name="check" size={18} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    maxHeight: "75%",
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
  scroll: {
    flexGrow: 0
  },
  option: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  optionActive: {
    backgroundColor: colors.bg,
    borderRadius: 8
  },
  optionText: {
    fontSize: fonts.size.sm,
    color: colors.text
  },
  optionTextActive: {
    fontWeight: fonts.weight.semiBold,
    color: colors.primary
  }
});
