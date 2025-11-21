import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

// Screens would be imported here
// import HomeScreen from './src/screens/HomeScreen';
// import SwapScreen from './src/screens/SwapScreen';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <SafeAreaView className="flex-1 bg-gray-900">
          <StatusBar barStyle="light-content" backgroundColor="#111827" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#111827',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {/* Stack screens would be defined here */}
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
