import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, Alert } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MakePayment({ visible, onClose }) {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [telephone, setTelephone] = useState('');

  const theme = useTheme();

  const handleInitiatePayment = async () => {
    try {
      const domain = await AsyncStorage.getItem('userdomain');
      const token = await AsyncStorage.getItem('userToken');

      if (!domain || !token) {
        Alert.alert('Error', 'Domain or token not found. Please try again.');
        return;
      }

      if (!telephone || !amount || !accountNumber) {
        Alert.alert('Validation Error', 'Please fill in all fields.');
        return;
      }

      const response = await axios.post(
        `https://${domain}/api/initiate/payment`,
        {
          telephone: telephone,
          amount: amount,
          account_number: accountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        Alert.alert('Payment Initiated', data.message);
        onClose(); 
      } else {
        Alert.alert('Payment Initiation Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
      console.error('Initiate payment error:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>MAKE PAYMENT</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Telephone to pay from"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />
          <View style={styles.modalButtons}>
            <Button mode="contained" style={styles.closeButton} onPress={onClose}>
              Close
            </Button>
            <Button mode="contained" style={styles.submitButton} onPress={handleInitiatePayment}>
              Initial
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#808080',
    width: '45%',
  },
  submitButton: {
    backgroundColor: '#2E97C0',
    width: '45%',
  },
});