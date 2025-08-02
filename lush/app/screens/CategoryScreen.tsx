import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Product } from '../../types/types';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAllCategories, getProductByCategoryId } from '../../src/config/api';

interface Category {
  id: string;
  name: string;
  icon?: string; 
}

const CategoryScreen = () => {
  const navigation = useNavigation();
  const { categoryId: initialCategoryId, categoryName: initialCategoryName } = useLocalSearchParams<{ categoryId: string, categoryName: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId || null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(initialCategoryName || null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const data = response.data;
        const dataWithId = data.map((item: { _id: any; }) => ({ ...item, id: item._id }));
        setCategories(dataWithId);
        if (!initialCategoryId && dataWithId.length > 0) {
          setSelectedCategoryId(dataWithId[0].id);
          setSelectedCategoryName(dataWithId[0].name);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [initialCategoryId]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (selectedCategoryId) {
        try {
          const response = await getProductByCategoryId(selectedCategoryId);
          const data = response.data;
          const dataWithId = data.map((item: { _id: any; }) => ({ ...item, id: item._id }));
          setProducts(dataWithId);
        } catch (error) {
          console.error('Error fetching products by category:', error);
        }
      }
    };
    fetchProductsByCategory();
  }, [selectedCategoryId]);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategoryId(category.id);
    setSelectedCategoryName(category.name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.leftPane}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategoryId === item.id && styles.selectedCategoryItem,
                ]}
                onPress={() => handleCategoryPress(item)}
              >
                {item.icon && <MaterialCommunityIcons name={item.icon as any} size={24} color={selectedCategoryId === item.id ? '#22c55e' : '#555'} />}
                <Text
                  style={[
                    styles.categoryName,
                    selectedCategoryId === item.id && styles.selectedCategoryName,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.rightPane}>
          <Text style={styles.rightPaneTitle}>{selectedCategoryName || 'Products'}</Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </View>
      </View>
      <FloatingCart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 50, // Adjust for safe area
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPane: {
    width: 120,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    paddingVertical: 10,
  },
  categoryItem: {
    paddingVertical: 15,
    paddingHorizontal: 2,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  selectedCategoryItem: {
    borderLeftColor: '#22c55e',
    backgroundColor: '#e6ffe6',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
    color: '#555',
  },
  selectedCategoryName: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  rightPane: {
    flex: 1,
    padding: 10,
  },
  rightPaneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  productListContent: {
    paddingBottom: 80, // Space for floating cart
  },
  productColumnWrapper: {
    justifyContent: 'space-between',
  },
});

export default CategoryScreen;
