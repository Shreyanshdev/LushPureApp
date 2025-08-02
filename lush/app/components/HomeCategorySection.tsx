import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllCategories } from '../../src/config/api';

interface Category {
  id: string;
  name: string;
  icon?: string; // Optional icon for categories
}

type RootStackParamList = {
  'screens/CategoryScreen': { categoryName: string; categoryId: string };
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const HomeCategorySection: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const data = response.data;
        const dataWithId = data.map((item: any) => ({ ...item, id: item._id }));
        // Limit to a few categories for the home screen
        setCategories(dataWithId.slice(0, 6)); 
      } catch (error) {
        console.error('Error fetching categories for home screen:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('screens/CategoryScreen', { categoryName: category.name, categoryId: category.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Want to shop by category?</Text>
      <Text style={styles.subHeading}>Here are some categories.</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category)}
            style={styles.categoryItem}
          >
            <View style={styles.iconContainer}>
              {category.icon ? (
                <MaterialCommunityIcons name={category.icon as any} size={30} color="#22c55e" />
              ) : (
                <MaterialCommunityIcons name="food-apple" size={30} color="#22c55e" /> // Default icon
              )}
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
  },
  subHeading: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 80, // Fixed width for consistent spacing
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6ffe6', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});

export default HomeCategorySection;
