// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import Domain from './pages/Domain';
import Login from './pages/Login';
import Account from './pages/account';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
// import { ReactQueryDevtools } from 'react-query/devtools'; // Optional: Devtools for React Query

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient(); // Create an instance of QueryClient

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'aliceblue',
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
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
            <Stack.Screen name="account" component={Account} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> Optional: Devtools for React Query */}
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
