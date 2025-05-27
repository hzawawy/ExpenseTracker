import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/appStyles';

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>💳 Smart Expense Tracker</Text>
  </View>
);

export default Header;
