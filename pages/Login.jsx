import React, { useState, useEffect } from "react";
import { View, StyleSheet, ToastAndroid, Image } from "react-native";
import { TextInput, Button, ActivityIndicator, Text } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSettings } from "../components/utils/Appsettings";
import { CommonActions } from '@react-navigation/native';

const Login = ({ navigation }) => {
  const { data: appSettings, isLoading, isError, error } = useAppSettings();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showReloadButton, setShowReloadButton] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      setShowReloadButton(false);
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
        } else {
          const storedDomain = await AsyncStorage.getItem("userdomain");
          if (storedDomain) {
            setDomain(storedDomain);
          } else {
            setErrorMessage("Domain not set. Please set the domain first.");
            navigation.navigate("Domain");
          }
        }
      } catch (error) {
        setErrorMessage("Failed to retrieve data. Please try again.");
        setShowReloadButton(true);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    setShowReloadButton(false);
    try {
      const response = await axios.post(`https://${domain}/api/login`, {
        email: username,
        password: password,
      });

      const data = response.data;
      if (data.success) {
        ToastAndroid.show(data.message, ToastAndroid.LONG);
        await AsyncStorage.setItem("userToken", data.data.token);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        );
        setUsername("");
        setPassword("");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    setErrorMessage("");
    setShowReloadButton(false);
    checkToken();
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
    <View style={styles.container}>
      {appSettings && appSettings.logo && (
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
        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        {showReloadButton && (
          <Button mode="contained" onPress={handleReload} style={styles.reloadButton}>
            Retry
          </Button>
        )}
        <TextInput
          mode="outlined"
          label="Enter username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
          theme={{colors:{primary:"black"}}}
        />
        <TextInput
          mode="outlined"
          label="Enter password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.input}
          theme={{colors:{primary:"black"}}}
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
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  input: {
    width: "89%",
    marginBottom: 16,
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
    marginBottom: 16,
  },
  reloadButton: {
    marginBottom: 16,
  },
});

export default Login;
