import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ToastAndroid, Image } from "react-native";
import { TextInput, Button, ActivityIndicator, Text } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSettings } from "../components/utils/Appsettings";

const Login = ({ navigation }) => {
  const { data: appSettings, isLoading, isError, error } = useAppSettings();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    const getDomain = async () => {
      try {
        const storedDomain = await AsyncStorage.getItem("userdomain");
        if (storedDomain) {
          setDomain(storedDomain);
        } else {
          Alert.alert("Domain not set", "Please set the domain first.");
          navigation.navigate("Domain");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to retrieve domain. Please try again.");
      }
    };
    getDomain();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://${domain}/api/login`, {
        email: username,
        password: password,
      });

      const data = response.data;
      if (data.success) {
        ToastAndroid.show(data.message, ToastAndroid.LONG);
        await AsyncStorage.setItem("userToken", data.data.token);
        navigation.navigate("Home");
        setUsername("");
        setPassword("");
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0077b6" />;
  }

  if (isError) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {appSettings.logo && (
        <Image
          source={{ uri: appSettings.logo }}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      <View
        style={[
          styles.loginContainer,
          { backgroundColor: appSettings.primary_color },
        ]}
      >
        <TextInput
          mode="outlined"
          label="Username"
          placeholder="Enter username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Enter password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={[
            styles.button,
            { backgroundColor: appSettings.tertiary_color },
          ]}
          loading={loading}
          disabled={loading}
        >
          Login
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
    backgroundColor: "white",
  },
  loginContainer: {
    width: "90%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(205, 239, 133, 0.5)",
    padding: 16,
    borderRadius: 8,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: "89%",
    marginBottom: 16,
    color: "black",
  },
  button: {
    width: "40%",
    backgroundColor: "#2E97C0",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontStyle: "italic",
    fontFamily: "serif",
  },
});

export default Login;
