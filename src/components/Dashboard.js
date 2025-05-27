import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/appStyles';
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

  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const currentBalance = getCurrentBalance(startingBalance, totalIncome, totalExpenses);
  const expensesByCategory = getExpensesByCategory(transactions);

  return (
    <ScrollView>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, {backgroundColor: '#e0f2fe'}]}>
            <View><Text style={styles.statTitle}>🏦 Starting Balance</Text><TouchableOpacity onPress={() => setShowStartingBalanceModal(true)}><Text style={styles.editBalanceText}>Tap to edit</Text></TouchableOpacity></View><Text style={styles.statAmount}>${startingBalance.toFixed(2)}</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#dcfce7'}]}><Text style={styles.statTitle}>💰 Total Income</Text><Text style={styles.statAmount}>${totalIncome.toFixed(2)}</Text></View>
        <View style={[styles.statCard, {backgroundColor: '#fee2e2'}]}><Text style={styles.statTitle}>💸 Total Expenses</Text><Text style={styles.statAmount}>${totalExpenses.toFixed(2)}</Text></View>
        <View style={[styles.statCard, {backgroundColor: currentBalance >= 0 ? '#dbeafe' : '#fecaca'}]}><Text style={styles.statTitle}>💳 Current Balance</Text><Text style={[styles.statAmount, {color: currentBalance >= 0 ? '#1f2937' : '#dc2626'}]}>${currentBalance.toFixed(2)}</Text></View>
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowReportsModal(true)}><Text style={styles.actionButtonText}>📊 View Reports</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowReceiptsModal(true)}><Text style={styles.actionButtonText}>📄 Receipts ({scannedReceipts.length})</Text></TouchableOpacity>
      </View>
      
      <View style={styles.transactionsContainer}>
        <View style={styles.viewTabsContainer}>
          <TouchableOpacity
            style={[styles.viewTab, transactionView === 'recent' && styles.viewTabActive]}
            onPress={() => setTransactionView('recent')}
          >
            <Text style={[styles.viewTabText, transactionView === 'recent' && styles.viewTabTextActive]}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewTab, transactionView === 'category' && styles.viewTabActive]}
            onPress={() => setTransactionView('category')}
          >
            <Text style={[styles.viewTabText, transactionView === 'category' && styles.viewTabTextActive]}>By Category</Text>
          </TouchableOpacity>
        </View>

        {transactionView === 'recent' && (
          <>
            {transactions.length === 0 ? (
              <Text style={styles.emptyText}>No transactions yet.</Text>
            ) : (
              transactions.slice(0, 15).map(transaction => ( // Show up to 15 recent transactions
                <TouchableOpacity key={transaction.id} style={styles.transactionItem} onLongPress={() => { setSelectedTransaction(transaction); setShowDeleteModal(true); }}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionDetails}>{transaction.category} • {transaction.date}</Text>
                  </View>
                  <Text style={[styles.transactionAmount, {color: transaction.type === 'income' ? '#16a34a' : '#dc2626'}]}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</Text>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {transactionView === 'category' && (
          <>
            {expensesByCategory.length === 0 ? (
              <Text style={styles.emptyText}>No expense data to categorize.</Text>
            ) : (
              expensesByCategory.map(({ category, amount }) => (
                <View key={category} style={styles.categorySummaryItem}>
                  <Text style={styles.categorySummaryText}>{category}</Text>
                  <Text style={styles.categorySummaryAmount}>${amount.toFixed(2)}</Text>
                </View>
              ))
            )}
          </>
        )}
      </View>

      {recurringIncome.length > 0 && (
        <View style={styles.recurringContainer}>
            <Text style={styles.sectionTitle}>Recurring Income</Text>
            {recurringIncome.map(recurring => (
                <TouchableOpacity key={recurring.id} style={styles.recurringItem} onLongPress={() => { Alert.alert('Delete Recurring Income', `Remove "${recurring.description}"?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', onPress: () => deleteRecurring(recurring.id), style: 'destructive' }]); }}>
                    <View><Text style={styles.recurringDescription}>{recurring.description}</Text><Text style={styles.recurringDetails}>{recurring.frequency} • ${recurring.amount.toFixed(2)}</Text></View><Text style={styles.recurringBadge}>🔄 Auto</Text>
                </TouchableOpacity>
            ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Dashboard;
