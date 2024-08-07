import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, Alert } from 'react-native';
import { ActivityIndicator, Button, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppSettings } from './utils/Appsettings';

export default function MakePayment({ visible, onClose, accountNumber }) {
  const [amount, setAmount] = useState('');
  const { data: appSettings, isLoading, isError, error } = useAppSettings();
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      const domain = await AsyncStorage.getItem('userdomain');
      const token = await AsyncStorage.getItem('userToken');

      if (!domain || !token) {
        Alert.alert('Error', 'Domain or access not found. Please try again.');
        setLoading(false);
        return;
      }

      if (!telephone || !amount) {
        Alert.alert('Validation ', 'Please fill in all fields.');
        setLoading(false);
        return;
      }

      if (!telephone.startsWith('0')) {
        Alert.alert('Validation ', 'The telephone number must start with 0.');
        setLoading(false);
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
        setAmount("")
        setTelephone("")
      } else {
        Alert.alert('Payment Initiation Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} color="#0077b6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }
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
          mode="outlined"
          label={"Amount"}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            theme={{colors:{primary:appSettings.primary_color}}}
          />
          <TextInput
            style={styles.input}
            label={"Telephone to pay from "}
            mode='outlined'
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            theme={{colors:{primary:appSettings.primary_color}}}

          />
          <View style={styles.modalButtons}>
            <Button mode="contained" style={styles.closeButton} onPress={onClose}>
              Close
            </Button>
            <Button mode="contained" style={styles.submitButton} onPress={handleInitiatePayment} loading={loading} disabled={loading}>
              Initiate
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
    // borderWidth: 1,
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
