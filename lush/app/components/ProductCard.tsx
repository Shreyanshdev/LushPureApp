// src/components/ProductCard.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Product } from '../../types/types.js'; 
import { useCart } from '../../src/context/CartContext';

type RootStackParamList = {
  'screens/ProductDetailScreen': { productId: string };
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface ProductCardProps {
  product: Product;
}



const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigation = useNavigation<NavigationProps>();
  const { addToCart, incrementQuantity, decrementQuantity, cart } = useCart();
  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handlePressCard = () => {
    navigation.navigate('screens/ProductDetailScreen', { productId: product.id });
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      incrementQuantity(product.id);
    } else if (type === 'decrement') {
      decrementQuantity(product.id);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handlePressCard}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={handlePressCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          {quantity === 0 ? (
            <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleQuantityChange('decrement')} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantityChange('increment')} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    margin: 8,
  },
  image: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 10,
  },
  productName: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  addButton: {
    backgroundColor: '#22c55e',
    width: 110,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quantityButton: {
    paddingHorizontal: 6,
  },
  quantityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default ProductCard;