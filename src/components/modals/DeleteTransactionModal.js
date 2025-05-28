import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../../styles/colors'; // Add this import

const DeleteTransactionModal = ({ visible, onClose, transaction, onConfirm }) => {
  const colors = useColors(); // Add this hook

  // Create themed styles
  const themedStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    modalText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    deleteButton: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    deleteButtonText: {
      color: '#FFFFFF',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={themedStyles.modalOverlay}>
        <View style={themedStyles.modalContent}>
          <Text style={themedStyles.modalTitle}>Delete Transaction</Text>
          <Text style={themedStyles.modalText}>
            Are you sure you want to delete "{transaction?.description}"?
          </Text>
          <View style={themedStyles.modalButtons}>
            <TouchableOpacity style={themedStyles.modalButton} onPress={onClose}>
              <Text style={themedStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[themedStyles.modalButton, themedStyles.deleteButton]} 
              onPress={() => onConfirm(transaction?.id)}
            >
              <Text style={[themedStyles.modalButtonText, themedStyles.deleteButtonText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteTransactionModal;
