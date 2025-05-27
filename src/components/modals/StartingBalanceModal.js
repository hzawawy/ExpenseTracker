import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/appStyles';

const StartingBalanceModal = ({ visible, onClose, balanceInput, setBalanceInput, onConfirm }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Set Starting Balance</Text>
        <Text style={styles.modalText}>
          Enter your current account balance to start tracking from:
        </Text>
        <TextInput
          style={styles.balanceInput}
          placeholder="0.00"
          value={balanceInput}
          onChangeText={setBalanceInput}
          keyboardType="numeric"
          autoFocus
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={onConfirm}>
            <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Set Balance</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default StartingBalanceModal;
