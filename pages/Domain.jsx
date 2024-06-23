import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ToastAndroid } from "react-native";
import { TextInput, Button, ActivityIndicator, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAppSettings } from "../components/utils/Appsettings";

const Domain = ({ navigation }) => {
  const [domain, setDomain] = useState("");
  const { isLoading } = useAppSettings();
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
  }, []);

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
          setDomain("");
        } else {
          Alert.alert("Invalid domain", "The provided domain is not allowed.");
        }
      } catch (error) {
        if (error.response) {
          Alert.alert(
            "Error",
            `Server responded with ${error.response.status}. Please try again.`
          );
        } else if (error.request) {
          Alert.alert(
            "Error",
            "No response received from server. Please check your internet connection."
          );
        } else {
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again later."
          );
        }
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
      <Text style={styles.mikro}>MIKROTIKTECH</Text>
      <View style={styles.formContainer}>
        <TextInput
          mode="outlined"
          label="Domain"
          placeholder="Enter domain"
          value={domain}
          onChangeText={(text) => setDomain(text)}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
          labelStyle={{ color: "white" }}
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
    backgroundColor: "green",
  },
  mikro: {
    fontWeight: "900",
    fontSize: 34,
    fontStyle: "italic",
    fontFamily: "serif",
  },
});

export default Domain;
