import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, Alert, FlatList, StyleSheet } from 'react-native';
import { useColors } from '../../styles/colors'; // Add this import

const MultipleItemsModal = ({ visible, onClose, extractedItems, setExtractedItems, onConfirm }) => {
    const colors = useColors(); // Add this hook
    
    const toggleItemSelection = (itemId) => {
        const updatedItems = extractedItems.map(item =>
            item.id === itemId ? { ...item, selected: !item.selected } : item
        );
        setExtractedItems(updatedItems);
    };

    const handleConfirm = () => {
        const selectedItems = extractedItems.filter(item => item.selected);
        if (selectedItems.length === 0) {
            Alert.alert('No Items Selected', 'Please select at least one item to add.');
            return;
        }
        onConfirm(selectedItems);
    };
    
    const selectedCount = extractedItems.filter(item => item.selected).length;

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
        itemsContainer: {
            flex: 1,
            padding: 16,
        },
        instructionText: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 16,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        itemCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.border,
        },
        itemCardSelected: {
            borderColor: colors.primary,
            backgroundColor: colors.primary + '10', // 10% opacity
        },
        itemInfo: {
            flex: 1,
        },
        itemDescription: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
        },
        itemCategory: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        itemConfidence: {
            fontSize: 12,
            color: colors.textTertiary,
        },
        itemAmountContainer: {
            alignItems: 'flex-end',
        },
        itemAmount: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.error,
            marginBottom: 4,
        },
        checkMark: {
            fontSize: 20,
            color: colors.primary,
            fontWeight: 'bold',
        },
        multipleItemsActions: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
        },
        addSelectedButton: {
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
        },
        addSelectedButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    // Define a renderItem function for the FlatList
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[themedStyles.itemCard, item.selected && themedStyles.itemCardSelected]}
            onPress={() => toggleItemSelection(item.id)}
        >
            <View style={themedStyles.itemInfo}>
                <Text style={themedStyles.itemDescription}>{item.description}</Text>
                <Text style={themedStyles.itemCategory}>Category: {item.category}</Text>
                <Text style={themedStyles.itemConfidence}>
                    Confidence: {Math.round((item.confidence || 0) * 100)}%
                </Text>
            </View>
            <View style={themedStyles.itemAmountContainer}>
                <Text style={themedStyles.itemAmount}>${item.amount.toFixed(2)}</Text>
                {item.selected && <Text style={themedStyles.checkMark}>✓</Text>}
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={themedStyles.modalContainer}>
                <View style={themedStyles.modalHeader}>
                    <Text style={themedStyles.modalHeaderTitle}>🛒 Detected Items</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={themedStyles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={themedStyles.itemsContainer}
                    ListHeaderComponent={
                        <Text style={themedStyles.instructionText}>
                            Select the items you want to add as transactions:
                        </Text>
                    }
                    data={extractedItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    removeClippedSubviews={false}
                />
                <View style={themedStyles.multipleItemsActions}>
                    <TouchableOpacity
                        style={themedStyles.addSelectedButton}
                        onPress={handleConfirm}
                    >
                        <Text style={themedStyles.addSelectedButtonText}>
                            Add Selected ({selectedCount})
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default MultipleItemsModal;
