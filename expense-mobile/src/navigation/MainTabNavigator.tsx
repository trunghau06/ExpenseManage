import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import Dashboard from '../screens/Dashboard';
import Transactions from '../screens/Transactions';
import Stats from '../screens/Stats';
import Settings from '../screens/Settings';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export type MainTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab =
  createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor:
          colors.primary,

        tabBarInactiveTintColor:
          colors.textMuted,

        tabBarStyle:
          styles.mainTab__bar,

        tabBarLabelStyle:
          styles.mainTab__label,

        tabBarItemStyle:
          styles.mainTab__item,

        tabBarIcon: ({
          color,
          size,
          focused,
        }) => {
          let iconName:
            keyof typeof Feather.glyphMap =
            'home';

          if (
            route.name ===
            'Dashboard'
          ) {
            iconName = 'home';
          }

          if (
            route.name ===
            'Transactions'
          ) {
            iconName =
              'file-text';
          }

          if (
            route.name ===
            'Stats'
          ) {
            iconName =
              'bar-chart-2';
          }

          if (
            route.name ===
            'Settings'
          ) {
            iconName =
              'settings';
          }

          return (
            <View
              style={[
                styles.mainTab__icon,
                focused &&
                  styles.mainTab__iconActive,
              ]}
            >
              <Feather
                name={iconName}
                size={size}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel:
            'Tổng quan',
        }}
      />

      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarLabel:
            'Sổ giao dịch',
        }}
      />

      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          tabBarLabel:
            'Thống kê',
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel:
            'Cài đặt',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  mainTab__bar: {
    height: 72,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor:
      colors.surface,
    borderTopWidth: 1,
    borderTopColor:
      colors.border,
  },

  mainTab__item: {
    paddingVertical: 2,
  },

  mainTab__label: {
    fontSize:
      fonts.size.xs,
    fontWeight:
      fonts.weight.medium,
  },

  mainTab__icon: {
    width: 34,
    height: 28,
    borderRadius: 8,
    justifyContent:
      'center',
    alignItems: 'center',
  },

  mainTab__iconActive: {
    backgroundColor:
      colors.focusRing,
  },
});