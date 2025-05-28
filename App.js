import React from 'react';
import { SafeAreaView, StatusBar, View, ActivityIndicator } from 'react-native';
import { styles } from './src/styles/appStyles';
import { useAppLogic } from './src/hooks/useAppLogic';

import Header from './src/components/ui/Header';
import TabNavigator from './src/components/ui/TabNavigator';
import Dashboard from './src/components/Dashboard';
import AddTransaction from './src/components/AddTransaction';

// Import All Modals
import StartingBalanceModal from './src/components/modals/StartingBalanceModal';
import DeleteTransactionModal from './src/components/modals/DeleteTransactionModal';
import ReportsModal from './src/components/modals/ReportsModal';
import ReceiptsModal from './src/components/modals/ReceiptsModal';
import ReceiptDetailModal from './src/components/modals/ReceiptDetailModal';
import OcrSettingsModal from './src/components/modals/OcrSettingsModal';
import MultipleItemsModal from './src/components/modals/MultipleItemsModal';

const App = () => {
  const logic = useAppLogic();

  // Check permissions on app startup
  if (logic.isLoading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
      
      <Header />

      <View style={styles.content}>
        {logic.activeTab === 'dashboard' ? (
          <Dashboard
            transactions={logic.transactions}
            recurringIncome={logic.recurringIncome}
            startingBalance={logic.startingBalance}
            scannedReceipts={logic.scannedReceipts}
            setShowReportsModal={logic.setShowReportsModal}
            setShowReceiptsModal={logic.setShowReceiptsModal}
            setShowDeleteModal={logic.setShowDeleteModal}
            setSelectedTransaction={logic.setSelectedTransaction}
            deleteRecurring={logic.deleteRecurring}
            setShowStartingBalanceModal={logic.setShowStartingBalanceModal}
          />
        ) : (
          <AddTransaction
            newTransaction={logic.newTransaction}
            setNewTransaction={logic.setNewTransaction}
            addTransaction={logic.addTransaction}
            scanReceipt={logic.scanReceipt}
            isProcessingReceipt={logic.isProcessingReceipt}
            ocrSettings={logic.ocrSettings}
          />
        )}
      </View>

      <TabNavigator activeTab={logic.activeTab} setActiveTab={logic.setActiveTab} />

      {/* --- Modals --- */}
      <StartingBalanceModal
        visible={logic.showStartingBalanceModal}
        onClose={() => logic.setShowStartingBalanceModal(false)}
        onRequestClose={() => logic.setShowStartingBalanceModal(false)}
        balanceInput={logic.balanceInput}
        setBalanceInput={logic.setBalanceInput}
        onConfirm={logic.setInitialBalance}
      />
      
      <DeleteTransactionModal
        visible={logic.showDeleteModal}
        onClose={() => logic.setShowDeleteModal(false)}
        onRequestClose={() => logic.setShowDeleteModal(false)}
        transaction={logic.selectedTransaction}
        onConfirm={logic.deleteTransaction}
      />

      <ReportsModal
        visible={logic.showReportsModal}
        onClose={() => logic.setShowReportsModal(false)}
        onRequestClose={() => logic.setShowReportsModal(false)}
        transactions={logic.transactions}
        startingBalance={logic.startingBalance}
      />

      <ReceiptsModal
        visible={logic.showReceiptsModal}
        onClose={() => logic.setShowReceiptsModal(false)}
        onRequestClose={() => logic.setShowReceiptsModal(false)}
        scannedReceipts={logic.scannedReceipts}
        setSelectedReceipt={logic.setSelectedReceipt}
        setShowReceiptDetailModal={logic.setShowReceiptDetailModal}
      />

      <ReceiptDetailModal
        visible={logic.showReceiptDetailModal}
        onClose={() => logic.setShowReceiptDetailModal(false)}
        onRequestClose={() => logic.setShowReceiptDetailModal(false)}
        receipt={logic.selectedReceipt}
      />
      
      <OcrSettingsModal
        visible={logic.showOcrSettingsModal}
        onClose={() => logic.setShowOcrSettingsModal(false)}
        onRequestClose={() => logic.setShowOcrSettingsModal(false)}
        ocrSettings={logic.ocrSettings}
        setOcrSettings={logic.setOcrSettings}
        ocrDebugInfo={logic.ocrDebugInfo}
      />

      <MultipleItemsModal
        visible={logic.showMultipleItemsModal}
        onClose={() => logic.setShowMultipleItemsModal(false)}
        onRequestClose={() => logic.setShowMultipleItemsModal(false)}
        extractedItems={logic.extractedItems}
        setExtractedItems={logic.setExtractedItems}
        onConfirm={(selectedItems) => logic.addMultipleTransactions(selectedItems, logic.currentReceiptIdForMultiAdd)}
      />

    </SafeAreaView>
  );
};

export default App;
