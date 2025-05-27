import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styles } from '../../styles/appStyles';

const ReceiptsModal = ({ visible, onClose, scannedReceipts, setSelectedReceipt, setShowReceiptDetailModal }) => (
    <Modal visible={visible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>📄 Scanned Receipts</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.receiptsContainer}>
                {scannedReceipts.length === 0 ? (
                    <View style={styles.emptyReceiptsContainer}>
                        <Text style={styles.emptyText}>No receipts scanned yet</Text>
                        <Text style={styles.emptySubtext}>Use the scanner on the 'Add' tab!</Text>
                    </View>
                ) : (
                    scannedReceipts.map(receipt => (
                        <TouchableOpacity 
                            key={receipt.id} 
                            style={styles.receiptItem}
                            onPress={() => {
                                setSelectedReceipt(receipt);
                                setShowReceiptDetailModal(true);
                            }}
                        >
                            <Image source={{uri: receipt.image}} style={styles.receiptImage} />
                            <View style={styles.receiptInfo}>
                                <Text style={styles.receiptMerchant}>{receipt.parsedData?.merchant || 'Unknown Store'}</Text>
                                <Text style={styles.receiptAmount}>
                                    Total: ${receipt.parsedData?.total?.toFixed(2) || '0.00'}
                                </Text>
                                <Text style={styles.receiptItems}>
                                    {receipt.parsedData?.items?.length || 0} items found
                                </Text>
                                <Text style={styles.receiptDate}>Scanned: {receipt.scanDate}</Text>
                                <Text style={styles.receiptTapHint}>Tap for detailed analysis</Text>
                            </View>
                            <View style={styles.receiptBadge}>
                                <Text style={styles.receiptBadgeText}>
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

export default ReceiptsModal;
