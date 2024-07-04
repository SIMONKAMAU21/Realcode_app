import React, { useState } from 'react';
import { Modal, StyleSheet, View, Alert, ToastAndroid } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSettings } from './utils/Appsettings';

export default function ChangeWiFiModal({ visible, onClose, onSubmit, accountId }) {
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [loading , setLoading] = useState(false)
  const { data: appSettings, isLoading, isError, error } = useAppSettings();


  const handleSubmit = async () => {
    if (!wifiName || !wifiPassword) {
      let errorMessage = '';
      if (!wifiName && !wifiPassword) {
        errorMessage = 'Please enter WiFi name and password.';
      } else if (!wifiName) {
        errorMessage = 'WiFi name is required.';
      } else {
        errorMessage = 'WiFi password is required.';
      }
      Alert.alert('Validation Error', errorMessage);
      return;
    }
if(wifiPassword.length < 8){
    ToastAndroid.show("The WiFi password must be at least 8 characters",ToastAndroid.BOTTOM)
    return;
}
    const domain = await AsyncStorage.getItem('userdomain');
    const apiUrl = `https://${domain}/api/change/wifi`;
    const token = await AsyncStorage.getItem('userToken');

    try {
      setLoading(true)
      const response = await axios.post(
        apiUrl,
        { wifi_name: wifiName, wifi_password: wifiPassword, account_id: accountId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        ToastAndroid.show(response.data.message,ToastAndroid.SHORT)
        onSubmit();
        onClose();
        setWifiName(""),
        setWifiPassword("")
      } else {
        ToastAndroid.show(response.data.message,ToastAndroid.LONG)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change WiFi credentials. Please try again later.');
    }finally{
      setLoading(false)
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
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change WiFi Username and Password</Text>
          <TextInput
            label='WiFi Name'
            value={wifiName}
            mode={"outlined"}
            onChangeText={setWifiName}
            style={styles.input}
            theme={{colors:{primary:appSettings.primary_color}}}
          />
          <TextInput
            label='WiFi Password'
            value={wifiPassword}
            mode={"outlined"}
            onChangeText={setWifiPassword}
            secureTextEntry
            style={styles.input}
            theme={{colors:{primary:appSettings.primary_color}}}

          />
          <View style={styles.modalButtons}>
            <Button mode='contained' style={styles.closeButton} onPress={onClose}>Close</Button>
            <Button mode='contained' style={styles.submitButton} onPress={handleSubmit} loading={loading} disabled={loading}>Change WiFi</Button>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#808080',
  },
  submitButton: {
    backgroundColor: '#2E97C0',
  },
});
