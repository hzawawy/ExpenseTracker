import React from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/appStyles';
import { CATEGORIES, FREQUENCIES } from '../constants';

const AddTransaction = ({
  newTransaction,
  setNewTransaction,
  addTransaction,
  scanReceipt,
  isProcessingReceipt,
  ocrSettings,
}) => (
  <ScrollView style={styles.formContainer}>
    <Text style={styles.formTitle}>Add Transaction</Text>
    
    <TouchableOpacity 
      style={[styles.scanButton, isProcessingReceipt && styles.scanButtonDisabled]} 
      onPress={scanReceipt}
      disabled={isProcessingReceipt}
    >
      <Text style={styles.scanButtonText}>
        {isProcessingReceipt ? '🔄 Processing...' : '📷 Scan Receipt'}
      </Text>
    </TouchableOpacity>

    {isProcessingReceipt && (
      <View style={styles.processingIndicator}>
        <Text style={styles.processingText}>🤖 Analyzing receipt...</Text>
        <Text style={styles.processingSubtext}>
          {ocrSettings.multipleAttempts ? 'Multiple attempts enabled' : 'Single attempt mode'}
        </Text>
        <Text style={styles.processingSubtext}>
          Advanced parsing: {ocrSettings.parseMode === 'advanced' ? 'ON' : 'OFF'}
        </Text>
      </View>
    )}
    
    <View style={styles.typeContainer}>
      <TouchableOpacity
        style={[styles.typeButton, newTransaction.type === 'expense' && styles.expenseActive]}
        onPress={() => setNewTransaction({...newTransaction, type: 'expense', isRecurring: false})}
      >
        <Text style={styles.typeText}>💸 Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.typeButton, newTransaction.type === 'income' && styles.incomeActive]}
        onPress={() => setNewTransaction({...newTransaction, type: 'income'})}
      >
        <Text style={styles.typeText}>💰 Income</Text>
      </TouchableOpacity>
    </View>

    {newTransaction.type === 'income' && (
      <TouchableOpacity
        style={[styles.recurringToggle, newTransaction.isRecurring && styles.recurringToggleActive]}
        onPress={() => setNewTransaction({...newTransaction, isRecurring: !newTransaction.isRecurring})}
      >
        <Text style={styles.recurringToggleText}>
          {newTransaction.isRecurring ? '🔄 Recurring Income' : '📅 One-time Income'}
        </Text>
      </TouchableOpacity>
    )}

    {newTransaction.isRecurring && newTransaction.type === 'income' && (
      <View style={styles.frequencyContainer}>
        <Text style={styles.label}>Frequency:</Text>
        <View style={styles.frequencyButtons}>
          {FREQUENCIES.map(freq => (
            <TouchableOpacity
              key={freq}
              style={[styles.frequencyButton, newTransaction.frequency === freq && styles.frequencyButtonActive]}
              onPress={() => setNewTransaction({...newTransaction, frequency: freq})}
            >
              <Text style={[styles.frequencyButtonText, newTransaction.frequency === freq && styles.frequencyButtonTextActive]}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )}

    <TextInput
      style={styles.input}
      placeholder="Amount (e.g., 50.00)"
      value={newTransaction.amount}
      onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
      keyboardType="numeric"
    />

    <View style={styles.categoryContainer}>
      <Text style={styles.label}>Category:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES[newTransaction.type].map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, newTransaction.category === category && styles.categoryButtonActive]}
            onPress={() => setNewTransaction({...newTransaction, category})}
          >
            <Text style={[styles.categoryButtonText, newTransaction.category === category && styles.categoryButtonTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

    <TextInput
      style={styles.input}
      placeholder="Description"
      value={newTransaction.description}
      onChangeText={(text) => setNewTransaction({...newTransaction, description: text})}
    />

    <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
      <Text style={styles.addButtonText}>
        {newTransaction.isRecurring ? 'Add Recurring Income' : 'Add Transaction'}
      </Text>
    </TouchableOpacity>
  </ScrollView>
);

export default AddTransaction;
