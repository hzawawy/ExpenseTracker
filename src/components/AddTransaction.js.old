import React from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../styles/colors'; // Add this import
import { CATEGORIES, FREQUENCIES } from '../constants';

const AddTransaction = ({
  newTransaction,
  setNewTransaction,
  addTransaction,
  scanReceipt,
  isProcessingReceipt,
  ocrSettings,
}) => {
  const colors = useColors(); // Add this hook
  
  // Create themed styles
  const themedStyles = StyleSheet.create({
    formContainer: {
      backgroundColor: colors.background,
      padding: 16,
    },
    formTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    scanButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: 'center',
    },
    scanButtonDisabled: {
      backgroundColor: colors.textTertiary,
    },
    scanButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    processingIndicator: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      borderColor: colors.border,
      borderWidth: 1,
    },
    processingText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    processingSubtext: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 4,
    },
    typeContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    typeButton: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
    },
    expenseActive: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
    incomeActive: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    typeText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    recurringToggle: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
    },
    recurringToggleActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    recurringToggleText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    frequencyContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    frequencyButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    frequencyButton: {
      padding: 12,
      borderRadius: 6,
      margin: 4,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
    },
    frequencyButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    frequencyButtonText: {
      color: colors.text,
      fontSize: 14,
    },
    frequencyButtonTextActive: {
      color: '#FFFFFF',
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
    },
    categoryContainer: {
      marginBottom: 16,
    },
    categoryScroll: {
      maxHeight: 100,
    },
    categoryButton: {
      padding: 12,
      borderRadius: 6,
      marginRight: 8,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryButtonText: {
      color: colors.text,
      fontSize: 14,
    },
    categoryButtonTextActive: {
      color: '#FFFFFF',
    },
    addButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <ScrollView style={themedStyles.formContainer}>
      <Text style={themedStyles.formTitle}>Add Transaction</Text>
      
      <TouchableOpacity 
        style={[themedStyles.scanButton, isProcessingReceipt && themedStyles.scanButtonDisabled]} 
        onPress={scanReceipt}
        disabled={isProcessingReceipt}
      >
        <Text style={themedStyles.scanButtonText}>
          {isProcessingReceipt ? '🔄 Processing...' : '📷 Scan Receipt'}
        </Text>
      </TouchableOpacity>

      {isProcessingReceipt && (
        <View style={themedStyles.processingIndicator}>
          <Text style={themedStyles.processingText}>🤖 Analyzing receipt...</Text>
          <Text style={themedStyles.processingSubtext}>
            {ocrSettings.multipleAttempts ? 'Multiple attempts enabled' : 'Single attempt mode'}
          </Text>
          <Text style={themedStyles.processingSubtext}>
            Advanced parsing: {ocrSettings.parseMode === 'advanced' ? 'ON' : 'OFF'}
          </Text>
        </View>
      )}
      
      <View style={themedStyles.typeContainer}>
        <TouchableOpacity
          style={[themedStyles.typeButton, newTransaction.type === 'expense' && themedStyles.expenseActive]}
          onPress={() => setNewTransaction({...newTransaction, type: 'expense', isRecurring: false})}
        >
          <Text style={themedStyles.typeText}>💸 Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[themedStyles.typeButton, newTransaction.type === 'income' && themedStyles.incomeActive]}
          onPress={() => setNewTransaction({...newTransaction, type: 'income'})}
        >
          <Text style={themedStyles.typeText}>💰 Income</Text>
        </TouchableOpacity>
      </View>

      {newTransaction.type === 'income' && (
        <TouchableOpacity
          style={[themedStyles.recurringToggle, newTransaction.isRecurring && themedStyles.recurringToggleActive]}
          onPress={() => setNewTransaction({...newTransaction, isRecurring: !newTransaction.isRecurring})}
        >
          <Text style={themedStyles.recurringToggleText}>
            {newTransaction.isRecurring ? '🔄 Recurring Income' : '📅 One-time Income'}
          </Text>
        </TouchableOpacity>
      )}

      {newTransaction.isRecurring && newTransaction.type === 'income' && (
        <View style={themedStyles.frequencyContainer}>
          <Text style={themedStyles.label}>Frequency:</Text>
          <View style={themedStyles.frequencyButtons}>
            {FREQUENCIES.map(freq => (
              <TouchableOpacity
                key={freq}
                style={[themedStyles.frequencyButton, newTransaction.frequency === freq && themedStyles.frequencyButtonActive]}
                onPress={() => setNewTransaction({...newTransaction, frequency: freq})}
              >
                <Text style={[themedStyles.frequencyButtonText, newTransaction.frequency === freq && themedStyles.frequencyButtonTextActive]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TextInput
        style={themedStyles.input}
        placeholder="Amount (e.g., 50.00)"
        placeholderTextColor={colors.textTertiary}
        value={newTransaction.amount}
        onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
        keyboardType="numeric"
      />

      <View style={themedStyles.categoryContainer}>
        <Text style={themedStyles.label}>Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={themedStyles.categoryScroll}>
          {CATEGORIES[newTransaction.type].map(category => (
            <TouchableOpacity
              key={category}
              style={[themedStyles.categoryButton, newTransaction.category === category && themedStyles.categoryButtonActive]}
              onPress={() => setNewTransaction({...newTransaction, category})}
            >
              <Text style={[themedStyles.categoryButtonText, newTransaction.category === category && themedStyles.categoryButtonTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={themedStyles.input}
        placeholder="Description"
        placeholderTextColor={colors.textTertiary}
        value={newTransaction.description}
        onChangeText={(text) => setNewTransaction({...newTransaction, description: text})}
      />

      <TouchableOpacity style={themedStyles.addButton} onPress={addTransaction}>
        <Text style={themedStyles.addButtonText}>
          {newTransaction.isRecurring ? 'Add Recurring Income' : 'Add Transaction'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTransaction;
