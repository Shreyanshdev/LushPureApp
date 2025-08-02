// src/components/SubscriptionBanner.tsx

import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  'screens/SubscriptionScreen': undefined;
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const SubscriptionBanner: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('screens/SubscriptionScreen')}
      style={styles.container}
    >
      <ImageBackground
        source={require('../../assets/images/subs.png')}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Text style={styles.title}>Want fresh milk daily?</Text>
        <Text style={styles.subtitle}>
          Buy a subscription and get real milk delivered directly from buffalo/cow to your home.
        </Text>
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.buyButton}
          onPress={() => navigation.navigate('screens/SubscriptionScreen')}>
            <Text style={styles.buyButtonText}>Buy Subscription</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageBackground: {
    justifyContent: 'center',
    padding: 20,
  },
  imageStyle: {
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ctaContainer: {
    alignItems: 'flex-start',
  },
  buyButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buyButtonText: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SubscriptionBanner;