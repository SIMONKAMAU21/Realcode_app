import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Alert, ToastAndroid } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function ChangePackageModal({ visible, onClose, onSubmit, accountId, accountNumber, account_type }) {
  const theme = useTheme();
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packages, setPackages] = useState([]);
  const [isHotspot, setIsHotspot] = useState(false);

  useEffect(() => {
    if (visible && accountId) {
      fetchPackages(accountId);
      if (account_type === 'Hotspot') {
        setIsHotspot(true);
      } else {
        setIsHotspot(false);
      }
    }
  }, [visible, accountId, account_type]);

  const fetchPackages = async (accountId) => {
    const domain = await AsyncStorage.getItem("userdomain")
    const apiUrl = `https://${domain}/api/packages/list?id=${accountId}`;
    const token = await AsyncStorage.getItem("userToken");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPackages(response.data.data);
        ToastAndroid.show(response.data.message, ToastAndroid.TOP);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch packages.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch packages. Please try again later.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'Please select a package.');
      return;
    }
    const domain = await AsyncStorage.getItem("userdomain");
    try {
      const apiUrl = `https://${domain}/api/change/package`;
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        apiUrl,
        { account_id: accountId, package_id: selectedPackage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        onSubmit(selectedPackage);
        onClose();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to change package.');
      }
    } catch (error) {
      console.error('Error changing package:', error);
      Alert.alert('Error', 'Failed to change package. Please try again later.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>CHANGE PACKAGE FOR :{accountNumber}</Text>
          <Picker
            selectedValue={selectedPackage}
            onValueChange={(itemValue) => setSelectedPackage(itemValue)}
            style={styles.picker}
            enabled={!isHotspot}
          >
            {packages.map((pkg) => (
              <Picker.Item key={pkg.id} label={`${pkg.bandwidth_name} @ KES ${pkg.price}`} value={pkg.id} />
            ))}
          </Picker>
          <View style={styles.modalButtons}>
            <Button mode='contained' style={styles.closeButton} onPress={onClose}>Close</Button>
            <Button mode='contained' style={styles.submitButton} onPress={handleSubmit}>Change Package</Button>
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
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
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
