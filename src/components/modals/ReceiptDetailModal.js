import React, { useState } from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useColors } from '../../styles/colors'; // Add this import

const ReceiptDetailModal = ({ visible, onClose, onRequestClose, receipt }) => {
    const [imageError, setImageError] = useState(false);
    const colors = useColors(); // Add this hook

    if (!receipt) return null;

    // Add safety check for image URI
    const hasValidImage = receipt.image && typeof receipt.image === 'string' && receipt.image.length > 0;

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
        receiptDetailContainer: {
            flex: 1,
            padding: 16,
        },
        receiptImageContainer: {
            alignItems: 'center',
            marginBottom: 24,
        },
        receiptDetailImage: {
            width: '100%',
            height: 300,
            borderRadius: 12,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
        },
        imageErrorContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.surface,
        },
        imageErrorText: {
            color: colors.textSecondary,
            textAlign: 'center',
            fontSize: 16,
        },
        receiptInfoSection: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        processingStep: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 4,
            paddingLeft: 8,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        infoLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            flex: 1,
        },
        infoValue: {
            fontSize: 16,
            color: colors.textSecondary,
            flex: 1,
            textAlign: 'right',
        },
        detectedItem: {
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        itemDetailInfo: {
            flex: 1,
        },
        itemDetailDescription: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
        },
        itemDetailCategory: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        itemDetailConfidence: {
            fontSize: 12,
            color: colors.textTertiary,
        },
        itemDetailAmount: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.error,
        },
        potentialItemsNote: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 12,
            fontStyle: 'italic',
        },
        potentialItem: {
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            borderLeftWidth: 3,
            borderLeftColor: colors.warning,
            borderWidth: 1,
            borderColor: colors.border,
        },
        potentialItemText: {
            fontSize: 14,
            color: colors.text,
            marginBottom: 4,
        },
        potentialItemScore: {
            fontSize: 12,
            color: colors.textTertiary,
        },
        rawTextContainer: {
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 12,
            maxHeight: 200,
            borderWidth: 1,
            borderColor: colors.border,
        },
        rawText: {
            fontSize: 12,
            color: colors.text,
            fontFamily: 'monospace',
            lineHeight: 16,
        },
    });

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onRequestClose}>
            <SafeAreaView style={themedStyles.modalContainer}>
                <View style={themedStyles.modalHeader}>
                    <Text style={themedStyles.modalHeaderTitle}>📄 Receipt Details</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={themedStyles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={themedStyles.receiptDetailContainer}>
                    <View style={themedStyles.receiptImageContainer}>
                        {hasValidImage && !imageError ? (
                            <Image 
                                source={{uri: receipt.image}} 
                                style={themedStyles.receiptDetailImage}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <View style={[themedStyles.receiptDetailImage, themedStyles.imageErrorContainer]}>
                                <Text style={themedStyles.imageErrorText}>
                                    {imageError ? 'Failed to load image' : 'No image available'}
                                </Text>
                            </View>
                        )}
                    </View>
                    
                    {receipt.parsedData?.processingSteps?.length > 0 && (
                        <View style={themedStyles.receiptInfoSection}>
                            <Text style={themedStyles.sectionTitle}>⚙️ Processing Steps</Text>
                            {receipt.parsedData.processingSteps.map((step, index) => (
                                <Text key={index} style={themedStyles.processingStep}>{step}</Text>
                            ))}
                        </View>
                    )}
                    
                    <View style={themedStyles.receiptInfoSection}>
                        <Text style={themedStyles.sectionTitle}>📋 Extracted Information</Text>
                        <InfoRow 
                            label="Merchant" 
                            value={receipt.parsedData?.merchant || 'Unknown'} 
                            colors={colors}
                        />
                        <InfoRow 
                            label="Date" 
                            value={receipt.parsedData?.date || 'Not found'} 
                            colors={colors}
                        />
                        <InfoRow 
                            label="Total" 
                            value={`$${receipt.parsedData?.total?.toFixed(2) || '0.00'}`} 
                            colors={colors}
                        />
                        <InfoRow 
                            label="Subtotal" 
                            value={`$${receipt.parsedData?.subtotal?.toFixed(2) || '0.00'}`} 
                            colors={colors}
                        />
                        <InfoRow 
                            label="Tax" 
                            value={`$${receipt.parsedData?.tax?.toFixed(2) || '0.00'}`} 
                            colors={colors}
                        />
                        <InfoRow 
                            label="Items Found" 
                            value={receipt.parsedData?.items?.length || 0} 
                            colors={colors}
                        />
                    </View>

                    {receipt.parsedData?.items?.length > 0 && (
                        <View style={themedStyles.receiptInfoSection}>
                            <Text style={themedStyles.sectionTitle}>🛒 Detected Items</Text>
                            {receipt.parsedData.items.map((item, index) => (
                                <DetectedItem key={item.id || index} item={item} colors={colors} styles={themedStyles} />
                            ))}
                        </View>
                    )}
                    
                    {receipt.parsedData?.potentialItems?.length > 0 && (
                        <View style={themedStyles.receiptInfoSection}>
                            <Text style={themedStyles.sectionTitle}>🔍 Potential Items</Text>
                            <Text style={themedStyles.potentialItemsNote}>
                                Lines that might be items but didn't match patterns:
                            </Text>
                            {receipt.parsedData.potentialItems.slice(0, 10).map((item, index) => (
                                <PotentialItem key={`${item.text}-${index}`} item={item} styles={themedStyles} />
                            ))}
                        </View>
                    )}
                    
                    <View style={themedStyles.receiptInfoSection}>
                        <Text style={themedStyles.sectionTitle}>📝 Raw OCR Text</Text>
                        <View style={themedStyles.rawTextContainer}>
                            <Text selectable style={themedStyles.rawText}>
                                {receipt.extractedText || 'No text extracted'}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const InfoRow = ({ label, value, colors }) => {
    const styles = StyleSheet.create({
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        infoLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            flex: 1,
        },
        infoValue: {
            fontSize: 16,
            color: colors.textSecondary,
            flex: 1,
            textAlign: 'right',
        },
    });

    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
};

const DetectedItem = ({ item, colors, styles }) => (
    <View style={styles.detectedItem}>
        <View style={styles.itemDetailInfo}>
            <Text style={styles.itemDetailDescription}>{item.description}</Text>
            <Text style={styles.itemDetailCategory}>Category: {item.category}</Text>
            <Text style={styles.itemDetailConfidence}>
                Confidence: {Math.round((item.confidence || 0) * 100)}%
            </Text>
        </View>
        <Text style={styles.itemDetailAmount}>${item.amount?.toFixed(2) || '0.00'}</Text>
    </View>
);

const PotentialItem = ({ item, styles }) => (
    <View style={styles.potentialItem}>
        <Text style={styles.potentialItemText}>Line {item.lineNumber}: {item.text}</Text>
        <Text style={styles.potentialItemScore}>Score: {Math.round((item.score || 0) * 100)}%</Text>
    </View>
);

export default ReceiptDetailModal;
