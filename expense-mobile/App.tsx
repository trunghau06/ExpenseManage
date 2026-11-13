import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import * as NavigationBar from 'expo-navigation-bar';

import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store/store';

export default function App() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}