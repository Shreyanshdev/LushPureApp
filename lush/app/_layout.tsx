// app/_layout.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import { useNavigationContainerRef } from '@react-navigation/native';
import { CartProvider } from '../src/context/CartContext';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Check if user is already logged in
        const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
        if (userLoggedIn === 'true') {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        SplashScreen.hideAsync(); // Hide the splash screen once app is ready
      }
    }

    prepareApp();
  }, []);

  const navigationRef = useNavigationContainerRef();

  

  if (!appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isLoggedIn ? 'index' : 'screens/LoginScreen'} // Set initial route based on login status
      >
        <Stack.Screen name="screens/LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/CategoryScreen" options={{ headerShown: false, title: 'Category' }} />
        <Stack.Screen name="screens/SubscriptionScreen" options={{ headerShown: false, title: 'Subscription' }} />
        <Stack.Screen name="screens/CheckoutScreen" options={{ headerShown: false, title: 'Checkout' }} />
        <Stack.Screen name="screens/PaymentScreen" options={{ headerShown: false, title: 'Payment' }} />
        <Stack.Screen name="screens/OrderTrackingScreen" options={{ headerShown: false, title: 'Track Order' }} />
        <Stack.Screen name="screens/ProductDetailScreen" options={{ headerShown: false }} />
        <Stack.Screen name="screens/ProfileScreen" options={{ headerShown: false }} />
        <Stack.Screen name="screens/AddressScreen" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});