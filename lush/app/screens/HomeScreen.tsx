// app/index.tsx

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';
import SubscriptionBanner from '../components/SubscriptionBanner';
import ProductSection from '../components/ProductSection';
import HomeCategorySection from '../components/HomeCategorySection';
import FloatingCart from '../components/FloatingCart';
import Footer from '../components/Footer';
import { Product } from '../../types/types';
import { getAllProducts, getAllCategories } from '../../src/config/api';

const HomeScreen: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        const data = response.data;
        console.log('Fetched products data:', data);
        const dataWithId = data.map((item: { _id: any; }) => ({ ...item, id: item._id }));
        setProducts(dataWithId);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const data = response.data;
        const dataWithId = data.map((item: { _id: any; }) => ({ ...item, id: item._id }));
        setCategories(dataWithId);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <SearchBar />
          <SubscriptionBanner />
          <ProductSection title="Bestsellers" products={products} />
          <HomeCategorySection />
        </ScrollView>
        <Footer />
        <FloatingCart />
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Use a consistent background for safe area
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    paddingBottom: 120, 
  },
});

export default HomeScreen;