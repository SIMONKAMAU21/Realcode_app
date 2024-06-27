import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import { useAppSettings } from "../components/utils/Appsettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const { data: appSettings, isLoading, isError, error } = useAppSettings();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const { width, height } = Dimensions.get("window");

  const handleLogout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("userToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Logout Failed", "Failed to logout. Please try again.");
    } finally {
      setLoading(false);
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
    <>
      <Button
        title="Logout"
        loading={loading}
        disabled={loading}
        onPress={handleLogout}
      />
      <View style={[styles.container, { height: height * 0.8 }]}>
        {appSettings && (
          <>
            {appSettings.logo && (
              <Image
                source={{ uri: appSettings.logo }}
                style={[
                  styles.logo,
                  { width: width * 0.5, height: width * 0.9 },
                ]}
                resizeMode="contain"
              />
            )}
            <View
              style={[
                styles.settingContainer,
                {
                  backgroundColor: appSettings.primary_color,
                  width: width * 0.9,
                  height: height * 0.3,
                },
              ]}
            >
              <Text style={styles.settingItem}>
                App Name: {appSettings.app_name}
              </Text>
              <Text style={styles.settingItem}>
                Telephone: {appSettings.telephone}
              </Text>
              <Text style={styles.settingItem}>Email: {appSettings.email}</Text>
              <Text style={styles.settingItem}>Title: {appSettings.title}</Text>
              <Text style={styles.settingItem}>
                Slogan: {appSettings.slogan}
              </Text>
            </View>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    marginBottom: 10,
    border: "2px solid black",
  },
  settingContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  settingItem: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight:"bold",
    // color:"white"
  },
});

export default Settings;
