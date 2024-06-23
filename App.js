import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, ActivityIndicator } from "react-native";
import Domain from "./pages/Domain";
import Login from "./pages/Login";
import Account from "./pages/account";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "react-query"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDomain = async () => {
      try {
        const storedDomain = await AsyncStorage.getItem("userdomain");
        if (storedDomain) {
          setInitialRoute("Login");
        } else {
          setInitialRoute("Domain");
        }
      } catch (error) {
        setInitialRoute("Domain");
      } finally {
        setLoading(false);
      }
    };
    checkDomain();
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
            <Stack.Screen name="Account" component={Account} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
