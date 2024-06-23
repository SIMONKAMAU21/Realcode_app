import React from 'react';
import { View, StyleSheet, Text, Image, Button, Alert } from 'react-native';
import { useAppSettings } from '../components/utils/Appsettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const { data: appSettings, isLoading, isError, error } = useAppSettings();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout Failed', 'Failed to logout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
    <View style={styles.container}>
      {appSettings && (
        <>
          {appSettings.logo && (
            <Image
              source={{ uri: appSettings.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <View style={styles.settingContainer}>
            <Text style={styles.settingItem}>App Name: {appSettings.app_name}</Text>
            <Text style={styles.settingItem}>Telephone: {appSettings.telephone}</Text>
            <Text style={styles.settingItem}>Email: {appSettings.email}</Text>
            <Text style={styles.settingItem}>Title: {appSettings.title}</Text>
            <Text style={styles.settingItem}>Slogan: {appSettings.slogan}</Text>
          </View>
          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
  },
  settingContainer: {
    width: '90%',
    backgroundColor: 'rgba(205, 239, 133, 0.5)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  settingItem: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Settings;
