import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ToastAndroid } from "react-native";
import { TextInput, Button, ActivityIndicator, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAppSettings } from "../components/utils/Appsettings";

const Domain = ({ navigation }) => {
  const [domain, setDomain] = useState("");
  const { data: appSettings, isLoading, isError, error } = useAppSettings();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkDomain = async () => {
      const storedDomain = await AsyncStorage.getItem("userdomain");
      if (storedDomain) {
        navigation.navigate("Login");
      }
      console.log("storedDomain", storedDomain);
    };
    checkDomain();
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0077b6" />;
  }

  if (isError) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  const handleSubmit = async () => {
    setLoading(true);
    const domainPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

    if (domainPattern.test(domain)) {
      try {
        const response = await axios.post(
          "https://landlord.mikrotiktech.co.ke/api/app/allowed",
          { domain }
        );
        if (response.data.data === "Successful") {
          await AsyncStorage.setItem("userdomain", domain);
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          navigation.navigate("Login");
        } else {
          Alert.alert("Invalid domain", "The provided domain is not allowed.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to verify domain. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Invalid domain", "Please enter a valid domain.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.mikro, { color: appSettings.primary_color }]}>
        MIKROTIKTECH
      </Text>
      <View
        style={[
          styles.formContainer,
          { backgroundColor: appSettings.primary_color },
        ]}
      >
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
          loading={loading}
          style={[
            styles.button,
            { backgroundColor: appSettings.tertiary_color },
          ]}
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
  formContainer: {
    width: "80%",
    padding: 16,
    marginTop: 20,
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
  },
  mikro: {
    fontWeight: "900",
    fontSize: 34,
    fontStyle: "italic",
    fontFamily: "serif",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontStyle: "italic",
    fontFamily: "serif",
  },
});

export default Domain;
