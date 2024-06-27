import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import Domain from "./pages/Domain";
import Login from "./pages/Login";
import Accounts from "./pages/account";
import Settings from "./pages/Settings";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from 'expo-updates';
import Icon from "react-native-vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Accounts") {
            iconName = "home";
          } else if (route.name === "info") {
            iconName = "information-circle";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accounts" component={Accounts} />
      <Tab.Screen name="info" component={Settings} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const checkDomain = async () => {
      try {
        const storedDomain = await AsyncStorage.getItem("userdomain");
        console.log("Stored domain:", storedDomain);
        if (storedDomain) {
          setInitialRoute("Login");
        } else {
          setInitialRoute("Domain");
        }
      } catch (error) {
        console.error("Failed to retrieve domain", error);
        setInitialRoute("Domain");
      } finally {
        setLoading(false);
      }
    };
    checkDomain();
  }, []);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          const { isNew } = await Updates.fetchUpdateAsync();
          if (isNew) {
            await Updates.reloadAsync();
          }
        }
      } catch (error) {
        console.error("Error checking for updates", error);
      }
    };

    checkForUpdates();
  }, []);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "aliceblue",
    },
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0077b6" style={styles.container} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              options={{ headerShown: false }}
              name="Domain"
              component={Domain}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={Login}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={HomeTabs}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
