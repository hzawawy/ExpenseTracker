import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useColors } from '../../styles/colors'; // Add this import

const ReceiptsModal = ({ visible, onClose, scannedReceipts, setSelectedReceipt, setShowReceiptDetailModal }) => {
    const colors = useColors(); // Add this hook

    // Create themed styles
    const themedStyles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.card,
        },
        modalHeaderTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        closeButton: {
            fontSize: 24,
            color: colors.textSecondary,
            padding: 8,
        },
        receiptsContainer: {
            flex: 1,
            padding: 16,
        },
        emptyReceiptsContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 80,
        },
        emptyText: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 8,
            textAlign: 'center',
        },
        emptySubtext: {
            fontSize: 16,
            color: colors.textTertiary,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        receiptItem: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        receiptImage: {
            width: 80,
            height: 100,
            borderRadius: 8,
            backgroundColor: colors.surface,
            marginRight: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        receiptInfo: {
            flex: 1,
        },
        receiptMerchant: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        receiptAmount: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.error,
            marginBottom: 4,
        },
        receiptItems: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 4,
        },
        receiptDate: {
            fontSize: 12,
            color: colors.textTertiary,
            marginBottom: 4,
        },
        receiptTapHint: {
            fontSize: 12,
            color: colors.primary,
            fontStyle: 'italic',
        },
        receiptBadge: {
            backgroundColor: colors.primary,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            minWidth: 50,
            alignItems: 'center',
        },
        receiptBadgeText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
        },
    });

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={themedStyles.modalContainer}>
                <View style={themedStyles.modalHeader}>
                    <Text style={themedStyles.modalHeaderTitle}>📄 Scanned Receipts</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={themedStyles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={themedStyles.receiptsContainer}>
                    {scannedReceipts.length === 0 ? (
                        <View style={themedStyles.emptyReceiptsContainer}>
                            <Text style={themedStyles.emptyText}>No receipts scanned yet</Text>
                            <Text style={themedStyles.emptySubtext}>Use the scanner on the 'Add' tab!</Text>
                        </View>
                    ) : (
                        scannedReceipts.map(receipt => (
                            <TouchableOpacity 
                                key={receipt.id} 
                                style={themedStyles.receiptItem}
                                onPress={() => {
                                    setSelectedReceipt(receipt);
                                    setShowReceiptDetailModal(true);
                                }}
                            >
                                <Image 
                                    source={{uri: receipt.image}} 
                                    style={themedStyles.receiptImage} 
                                />
                                <View style={themedStyles.receiptInfo}>
                                    <Text style={themedStyles.receiptMerchant}>
                                        {receipt.parsedData?.merchant || 'Unknown Store'}
                                    </Text>
                                    <Text style={themedStyles.receiptAmount}>
                                        Total: ${receipt.parsedData?.total?.toFixed(2) || '0.00'}
                                    </Text>
                                    <Text style={themedStyles.receiptItems}>
                                        {receipt.parsedData?.items?.length || 0} items found
                                    </Text>
                                    <Text style={themedStyles.receiptDate}>
                                        Scanned: {receipt.scanDate}
                                    </Text>
                                    <Text style={themedStyles.receiptTapHint}>
                                        Tap for detailed analysis
                                    </Text>
                                </View>
                                <View style={themedStyles.receiptBadge}>
                                    <Text style={themedStyles.receiptBadgeText}>
                                        {Math.round((receipt.confidence || 0) * 100)}%
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

export default ReceiptsModal;
