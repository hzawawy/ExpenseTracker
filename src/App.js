import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Reports from './components/Reports';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      amount: 45.99,
      category: 'Food',
      description: 'Grocery shopping',
      date: '2025-05-20',
      type: 'expense'
    },
    {
      id: 2,
      amount: 120.00,
      category: 'Clothes',
      description: 'New shirt',
      date: '2025-05-18',
      type: 'expense'
    },
    {
      id: 3,
      amount: 3500.00,
      category: 'Income',
      description: 'Salary',
      date: '2025-05-15',
      type: 'income',
      frequency: 'monthly'
    }
  ]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = async (newTransactions) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      amount: parseFloat(transaction.amount)
    };
    const updatedTransactions = [...transactions, newTransaction];
    saveTransactions(updatedTransactions);
  };

  const TabButton = ({ id, iconName, label, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={() => onPress(id)}
    >
      <Icon name={iconName} size={24} color={isActive ? '#fff' : '#666'} />
      <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'add':
        return <AddTransaction onAddTransaction={addTransaction} />;
      case 'reports':
        return <Reports transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your income and expenses</Text>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={styles.tabContainer}>
        <TabButton
          id="dashboard"
          iconName="dashboard"
          label="Dashboard"
          isActive={activeTab === 'dashboard'}
          onPress={setActiveTab}
        />
        <TabButton
          id="add"
          iconName="add-circle"
          label="Add"
          isActive={activeTab === 'add'}
          onPress={setActiveTab}
        />
        <TabButton
          id="reports"
          iconName="trending-up"
          label="Reports"
          isActive={activeTab === 'reports'}
          onPress={setActiveTab}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeTabLabel: {
    color: '#fff',
  },
});

export default App;

