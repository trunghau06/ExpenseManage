import React, {
  useEffect,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import Login from '../screens/Login';
import Register from '../screens/Register';
import MainTabNavigator from './MainTabNavigator';

import {
  restoreLogin,
} from '../features/auth/authSlice';

import {
  AppDispatch,
  RootState,
} from '../store/store';

import { colors } from '../theme/colors';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch =
    useDispatch<AppDispatch>();

  const {
    isAuthenticated,
    isRestoring,
  } = useSelector(
    (state: RootState) =>
      state.auth
  );

  useEffect(() => {
    dispatch(restoreLogin());
  }, [dispatch]);

  if (isRestoring) {
    return (
      <View
        style={
          styles.rootNavigator__loading
        }
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
            />

            <Stack.Screen
              name="Register"
              component={Register}
            />
          </>
        ) : (
          <Stack.Screen
            name="Main"
            component={
              MainTabNavigator
            }
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  rootNavigator__loading: {
    flex: 1,
    justifyContent:
      'center',
    alignItems: 'center',
    backgroundColor:
      colors.bg,
  },
});