// src/components/Footer.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, usePathname } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  '/': undefined;
  'screens/CategoryScreen': { categoryName: string; categoryId: string };
  'screens/SubscriptionScreen': undefined;
  'screens/OrderTrackingScreen': undefined;
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: 'home', route: '/' },
    { name: 'Categories', icon: 'grid', route: 'screens/CategoryScreen' },
    { name: 'Subscription', icon: 'credit-card', route: 'screens/SubscriptionScreen' },
    { name: 'Orders', icon: 'clipboard', route: 'screens/OrderTrackingScreen' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          onPress={() => {
            if (item.route === 'screens/CategoryScreen') {
              navigation.navigate(item.route, { categoryName: '', categoryId: '' });
            } else if (item.route === '/') {
              navigation.navigate(item.route);
            } else if (item.route === 'screens/SubscriptionScreen') {
              navigation.navigate(item.route);
            } else if (item.route === 'screens/OrderTrackingScreen') {
              navigation.navigate(item.route);
            }
          }}
          style={styles.navItem}
        >
          <Feather
            name={item.icon as any}
            size={28}
            color={pathname === item.route ? '#059669' : '#4b5563'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Footer;