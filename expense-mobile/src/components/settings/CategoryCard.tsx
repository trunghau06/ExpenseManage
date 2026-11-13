import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import EmptyState from '../ui/EmptyState';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export interface SettingCategory {
  id: string;
  name: string;
  icon?: keyof typeof Feather.glyphMap;
}

interface CategoryCardProps {
  categories?: SettingCategory[];
  onAddPress?: () => void;
  onCategoryPress?: (
    category: SettingCategory
  ) => void;
}

export default function CategoryCard({
  categories = [],
  onAddPress,
  onCategoryPress,
}: CategoryCardProps) {
  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryCard__header}>
        <View style={styles.categoryCard__heading}>
          <Text style={styles.categoryCard__title}>
            Danh mục
          </Text>

          <Text style={styles.categoryCard__subtitle}>
            Quản lý danh mục thu và chi
          </Text>
        </View>

        <TouchableOpacity
          style={styles.categoryCard__addButton}
          activeOpacity={0.8}
          onPress={onAddPress}
        >
          <Feather
            name="plus"
            size={17}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {categories.length === 0 ? (
        <EmptyState text="Chưa có dữ liệu danh mục" />
      ) : (
        <View style={styles.categoryCard__list}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard__item}
              activeOpacity={0.8}
              onPress={() =>
                onCategoryPress?.(category)
              }
            >
              <View style={styles.categoryCard__icon}>
                <Feather
                  name={category.icon || 'tag'}
                  size={17}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.categoryCard__name}>
                {category.name}
              </Text>

              <Feather
                name="chevron-right"
                size={17}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  categoryCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },

  categoryCard__heading: {
    flex: 1,
  },

  categoryCard__title: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },

  categoryCard__subtitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
    color: colors.textMuted,
  },

  categoryCard__addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  categoryCard__list: {
    gap: 2,
  },

  categoryCard__item: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  categoryCard__icon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  categoryCard__name: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    color: colors.text,
  },
});