import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useColors } from '../styles/colors'; // Add this import
import { getTotalIncome, getTotalExpenses, getCurrentBalance, getExpensesByCategory } from '../utils/transactionUtils';

const Dashboard = ({
  transactions,
  recurringIncome,
  startingBalance,
  scannedReceipts,
  setShowReportsModal,
  setShowReceiptsModal,
  setShowDeleteModal,
  setSelectedTransaction,
  deleteRecurring,
  setShowStartingBalanceModal
}) => {
  const [transactionView, setTransactionView] = useState('recent');
  const colors = useColors(); // Add this hook

  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const currentBalance = getCurrentBalance(startingBalance, totalIncome, totalExpenses);
  const expensesByCategory = getExpensesByCategory(transactions);

  // Create themed styles
  const themedStyles = StyleSheet.create({
    statsContainer: {
      padding: 16,
    },
    statCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statCardBalance: {
      backgroundColor: colors.surface,
    },
    statCardIncome: {
      backgroundColor: colors.success + '20', // 20% opacity
    },
    statCardExpense: {
      backgroundColor: colors.error + '20', // 20% opacity
    },
    statCardCurrentBalance: {
      backgroundColor: currentBalance >= 0 ? colors.success + '20' : colors.error + '20',
    },
    statTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    editBalanceText: {
      fontSize: 12,
      color: colors.primary,
      marginTop: 4,
    },
    statAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    statAmountBalance: {
      color: currentBalance >= 0 ? colors.success : colors.error,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    actionButton: {
      flex: 1,
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    transactionsContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    viewTabsContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 4,
    },
    viewTab: {
      flex: 1,
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    viewTabActive: {
      backgroundColor: colors.primary,
    },
    viewTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    viewTabTextActive: {
      color: '#FFFFFF',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      padding: 32,
      fontStyle: 'italic',
    },
    transactionItem: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    transactionDetails: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    categorySummaryItem: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    categorySummaryText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    categorySummaryAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.error,
    },
    recurringContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    recurringItem: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    recurringDescription: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    recurringDetails: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    recurringBadge: {
      backgroundColor: colors.success,
      color: '#FFFFFF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 'bold',
      marginLeft: 'auto',
    },
  });

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={themedStyles.statsContainer}>
        <View style={[themedStyles.statCard, themedStyles.statCardBalance]}>
          <View>
            <Text style={themedStyles.statTitle}>🏦 Starting Balance</Text>
            <TouchableOpacity onPress={() => setShowStartingBalanceModal(true)}>
              <Text style={themedStyles.editBalanceText}>Tap to edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={themedStyles.statAmount}>${startingBalance.toFixed(2)}</Text>
        </View>
        
        <View style={[themedStyles.statCard, themedStyles.statCardIncome]}>
          <Text style={themedStyles.statTitle}>💰 Total Income</Text>
          <Text style={themedStyles.statAmount}>${totalIncome.toFixed(2)}</Text>
        </View>
        
        <View style={[themedStyles.statCard, themedStyles.statCardExpense]}>
          <Text style={themedStyles.statTitle}>💸 Total Expenses</Text>
          <Text style={themedStyles.statAmount}>${totalExpenses.toFixed(2)}</Text>
        </View>
        
        <View style={[themedStyles.statCard, themedStyles.statCardCurrentBalance]}>
          <Text style={themedStyles.statTitle}>💳 Current Balance</Text>
          <Text style={[themedStyles.statAmount, themedStyles.statAmountBalance]}>
            ${currentBalance.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={themedStyles.actionButtonsContainer}>
        <TouchableOpacity style={themedStyles.actionButton} onPress={() => setShowReportsModal(true)}>
          <Text style={themedStyles.actionButtonText}>📊 View Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themedStyles.actionButton} onPress={() => setShowReceiptsModal(true)}>
          <Text style={themedStyles.actionButtonText}>📄 Receipts ({scannedReceipts.length})</Text>
        </TouchableOpacity>
      </View>
      
      <View style={themedStyles.transactionsContainer}>
        <View style={themedStyles.viewTabsContainer}>
          <TouchableOpacity
            style={[themedStyles.viewTab, transactionView === 'recent' && themedStyles.viewTabActive]}
            onPress={() => setTransactionView('recent')}
          >
            <Text style={[themedStyles.viewTabText, transactionView === 'recent' && themedStyles.viewTabTextActive]}>
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[themedStyles.viewTab, transactionView === 'category' && themedStyles.viewTabActive]}
            onPress={() => setTransactionView('category')}
          >
            <Text style={[themedStyles.viewTabText, transactionView === 'category' && themedStyles.viewTabTextActive]}>
              By Category
            </Text>
          </TouchableOpacity>
        </View>

        {transactionView === 'recent' && (
          <>
            {transactions.length === 0 ? (
              <Text style={themedStyles.emptyText}>No transactions yet.</Text>
            ) : (
              transactions.slice(0, 15).map(transaction => (
                <TouchableOpacity 
                  key={transaction.id} 
                  style={themedStyles.transactionItem} 
                  onLongPress={() => { 
                    setSelectedTransaction(transaction); 
                    setShowDeleteModal(true); 
                  }}
                >
                  <View style={themedStyles.transactionInfo}>
                    <Text style={themedStyles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={themedStyles.transactionDetails}>
                      {transaction.category} • {transaction.date}
                    </Text>
                  </View>
                  <Text style={[
                    themedStyles.transactionAmount, 
                    { color: transaction.type === 'income' ? colors.success : colors.error }
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {transactionView === 'category' && (
          <>
            {expensesByCategory.length === 0 ? (
              <Text style={themedStyles.emptyText}>No expense data to categorize.</Text>
            ) : (
              expensesByCategory.map(({ category, amount }) => (
                <View key={category} style={themedStyles.categorySummaryItem}>
                  <Text style={themedStyles.categorySummaryText}>{category}</Text>
                  <Text style={themedStyles.categorySummaryAmount}>${amount.toFixed(2)}</Text>
                </View>
              ))
            )}
          </>
        )}
      </View>

      {recurringIncome.length > 0 && (
        <View style={themedStyles.recurringContainer}>
          <Text style={themedStyles.sectionTitle}>Recurring Income</Text>
          {recurringIncome.map(recurring => (
            <TouchableOpacity 
              key={recurring.id} 
              style={themedStyles.recurringItem} 
              onLongPress={() => { 
                Alert.alert(
                  'Delete Recurring Income', 
                  `Remove "${recurring.description}"?`, 
                  [
                    { text: 'Cancel', style: 'cancel' }, 
                    { text: 'Delete', onPress: () => deleteRecurring(recurring.id), style: 'destructive' }
                  ]
                ); 
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={themedStyles.recurringDescription}>{recurring.description}</Text>
                <Text style={themedStyles.recurringDetails}>
                  {recurring.frequency} • ${recurring.amount.toFixed(2)}
                </Text>
              </View>
              <Text style={themedStyles.recurringBadge}>🔄 Auto</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Dashboard;
