import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ToastAndroid } from 'react-native';

export default function Confirmpayment({ visible, onSubmit, onClose }) {
  const [transactionId, setTransactionId] = useState('');
  const [loading,setLoading] = useState(false)

  const handleConfirmPayment = async () => {
    try {
      setLoading(true)
      const domain = await AsyncStorage.getItem('userdomain');
      const token = await AsyncStorage.getItem('userToken');

      if (!domain || !token) {
        Alert.alert('Error', 'Domain or token not found. Please try again.');
        return;
      }

      const response = await axios.post(
        `https://${domain}/api/confirm/payment`,
        {
          transaction_id: transactionId, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        // ToastAndroid.show(data.message, ToastAndroid.TOP);
        Alert.alert('Payment Confirmed', data.message);
        onSubmit(); 
        setTransactionId("")
      } else {
        Alert.alert('Payment Confirmation Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm payment. Please try again.');
    }finally{
      setLoading(false)
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType='slide' transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm payment form</Text>
          <TextInput
            style={styles.input}
            value={transactionId}
            onChangeText={setTransactionId}
            placeholder='Enter Mpesa Transaction Code'
          />
          <View style={styles.modalButtons}>
            <Button style={styles.closeButton} mode='contained' onPress={onClose}>
              Close
            </Button>
            <Button style={styles.submitButton} mode='contained' loading={loading} disabled={loading} onPress={handleConfirmPayment}>
              Submit
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
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
