import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/appStyles';

const TabNavigator = ({ activeTab, setActiveTab }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === 'dashboard' && styles.activeTab]}
      onPress={() => setActiveTab('dashboard')}
    >
      <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.activeTabLabel]}>📊 Dashboard</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === 'add' && styles.activeTab]}
      onPress={() => setActiveTab('add')}
    >
      <Text style={[styles.tabLabel, activeTab === 'add' && styles.activeTabLabel]}>➕ Add</Text>
    </TouchableOpacity>
  </View>
);

export default TabNavigator;
