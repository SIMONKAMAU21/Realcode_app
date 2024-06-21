import React, { useState } from "react";
import { View, StyleSheet, Alert, Image, ToastAndroid } from "react-native";
import { TextInput, Button, ActivityIndicator, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAppSettings } from "../components/utils/Appsettings";

const Domain = ({ navigation }) => {
  const [domain, setDomain] = useState("");
  const { data: appSettings, isLoading, isError, error } = useAppSettings();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0077b6" />;
  }

  if (isError) {
    return <Text>Error: {error}</Text>; // Display the error message if there's an error
  }

  const handleSubmit = async () => {
    const domainPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

    if (domainPattern.test(domain)) {
      try {
        const response = await axios.post(
          "https://landlord.mikrotiktech.co.ke/api/app/allowed",
          {
            domain: domain,
          }
        );

        if (response.data.data === "Successful") {
          await AsyncStorage.setItem("userdomain", domain);
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          navigation.navigate("Login");
        } else {
          Alert.alert("Invalid domain", "The provided domain is not allowed.");
        }
      } catch (error) {
        console.error('Domain verification error:', error);
        Alert.alert("Error", "Failed to verify domain. Please try again.");
      }
    } else {
      Alert.alert("Invalid domain", "Please enter a valid domain.");
    }
  };

  return (
    <View style={styles.container}>
      {appSettings.logo && (
        <Image
          source={{ uri: appSettings.logo }}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      <View style={[styles.formContainer, { backgroundColor: appSettings.primary_color }]}>
        <TextInput
          mode="outlined"
          label="Domain"
          placeholder="Enter domain"
          value={domain}
          onChangeText={(text) => setDomain(text)}
          style={styles.input}
          theme={{ colors: { primary: appSettings.primary_color } }}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.button,{backgroundColor:appSettings.tertiary_color}]}
          labelStyle={{ color: "white" }}
          theme={{ colors: { primary: appSettings.tertiary_color } }}
        >
          Submit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  formContainer: {
    width: "80%",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 8,
    backgroundColor: "#2E97C0",
  },
});

export default Domain;
