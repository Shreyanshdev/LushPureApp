// src/components/FloatingCart.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../src/context/CartContext';

type RootStackParamList = {
    'screens/CheckoutScreen': undefined;
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;


const FloatingCart: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { totalItems, totalCost } = useCart();

  if (totalItems === 0) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('screens/CheckoutScreen')}
        style={styles.cartButton}
      >
        <Text style={styles.cartText}>
          {totalItems} Items | ₹{totalCost}
        </Text>
        <View style={styles.viewCartContainer}>
          <Text style={styles.viewCartText}>View Cart</Text>
          <Feather name="shopping-cart" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
});

export default FloatingCart;