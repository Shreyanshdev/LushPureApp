import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  OrderTrackingScreen: { orderId: string };
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const PaymentScreen = () => {
  const { order } = useLocalSearchParams<{ order: any }>();
  const navigation = useNavigation<NavigationProps>();

  const handlePayment = async () => {
    // In a real app, this would trigger the Razorpay payment flow.
    // For now, we'll just navigate to the order tracking screen.
    navigation.navigate('OrderTrackingScreen', { orderId: order.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text>Order ID: {order.id}</Text>
      <Text>Total Amount: ₹{order.totalCost}</Text>
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentScreen;
