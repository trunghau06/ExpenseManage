import React, { useEffect } from 'react';
import {
  ActivityIndicator,
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
import Dashboard from '../screens/Dashboard';

import {
  restoreLogin,
} from '../features/auth/authSlice';

import {
  AppDispatch,
  RootState,
} from '../app/store';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isAuthenticated,
    isRestoring,
  } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(restoreLogin());
  }, [dispatch]);

  if (isRestoring) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#1E40AF"
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
            name="Dashboard"
            component={Dashboard}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}