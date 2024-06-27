import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';

const MandatoryUpdateScreen = () => {
  const handleUpdate = async () => {
    try {
      const { isNew } = await Updates.fetchUpdateAsync();
      if (isNew) {
        Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Error updating app', error);
      // Handle error updating app
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>A new version is available!</Text>
      <Button title="Update Now" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default MandatoryUpdateScreen;
