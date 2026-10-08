import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '../theme/colors';

export default function Dashboard() {
  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});