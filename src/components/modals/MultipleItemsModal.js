import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { styles } from '../../styles/appStyles';

const MultipleItemsModal = ({ visible, onClose, extractedItems, setExtractedItems, onConfirm }) => {
    
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

    // 👇 2. Define a renderItem function for the FlatList
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.itemCard, item.selected && styles.itemCardSelected]}
            onPress={() => toggleItemSelection(item.id)}
        >
            <View style={styles.itemInfo}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemCategory}>Category: {item.category}</Text>
                <Text style={styles.itemConfidence}>Confidence: {Math.round((item.confidence || 0) * 100)}%</Text>
            </View>
            <View style={styles.itemAmountContainer}>
                <Text style={styles.itemAmount}>${item.amount.toFixed(2)}</Text>
                {item.selected && <Text style={styles.checkMark}>✓</Text>}
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderTitle}>🛒 Detected Items</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.itemsContainer}
                    ListHeaderComponent={
                        <Text style={styles.instructionText}>
                            Select the items you want to add as transactions:
                        </Text>
                    }
                    data={extractedItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    // This optional prop can sometimes help with scrolling issues in modals
                    removeClippedSubviews={false} 
                />
                <View style={styles.multipleItemsActions}>
                    <TouchableOpacity
                        style={styles.addSelectedButton}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.addSelectedButtonText}>Add Selected ({selectedCount})</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default MultipleItemsModal;
