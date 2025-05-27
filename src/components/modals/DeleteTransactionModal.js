import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/appStyles';

const DeleteTransactionModal = ({ visible, onClose, transaction, onConfirm }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Delete Transaction</Text>
        <Text style={styles.modalText}>
          Are you sure you want to delete "{transaction?.description}"?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={() => onConfirm(transaction?.id)}>
            <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default DeleteTransactionModal;
