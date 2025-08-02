// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { customerLogin, deliveryLogin } from '../../src/config/api';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();

  const [loginType, setLoginType] = useState<'customer' | 'delivery'>('customer');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    let payload: object;

    if (loginType === 'customer') {
      if (!phoneNumber || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
        setError('Please enter a valid 10-digit phone number.');
        setLoading(false);
        return;
      }
      payload = { phone: phoneNumber };
    } else {
      if (!email || !password) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      payload = { email, password };
    }

    try {
      let response;
      if (loginType === 'customer') {
        response = await customerLogin(payload);
      } else {
        response = await deliveryLogin(payload);
      }
      const data = response.data;

      if (response.status === 200) {
        const accessToken = data.accessToken || data.token; // Just in case your API uses either
        const userData = data.customer || data.deliveryPartner || data.user || null;

        if (accessToken && userData) {
          // Save token and login flags in AsyncStorage
          await AsyncStorage.setItem('userToken', accessToken);
          await AsyncStorage.setItem('userLoggedIn', 'true');
          await AsyncStorage.setItem('userId', userData._id);

          console.log('Login successful! Token:', accessToken);

          // Navigate to the main app screen (index)
          router.replace('/');
          return;
        } else {
          Alert.alert('Login Successful', data.message || 'Please check your phone/email for verification.');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        console.error('API Error:', data);
      }
    } catch (e) {
      console.error('Network or unexpected error:', e);
      setError('Could not connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/your_background.jpg')} // Ensure this path is correct
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} // Use padding for both platforms for consistency
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Adjust Android offset
      >
        <View style={styles.overlay}>
          <View style={styles.svgContainer}>
            <Text style={styles.svgText}>
              <Feather name="truck" size={80} color="#fff" />
            </Text>
            <Text style={styles.welcomeText}>Fresh Deliveries, Daily!</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back!</Text>
            <Text style={styles.cardSubtitle}>
              {loginType === 'customer' ? 'Enter your phone number to continue' : 'Login as Delivery Partner'}
            </Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, loginType === 'customer' && styles.toggleButtonActive]}
                onPress={() => setLoginType('customer')}
              >
                <Text style={[styles.toggleButtonText, loginType === 'customer' && styles.toggleButtonTextActive]}>
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, loginType === 'delivery' && styles.toggleButtonActive]}
                onPress={() => setLoginType('delivery')}
              >
                <Text style={[styles.toggleButtonText, loginType === 'delivery' && styles.toggleButtonTextActive]}>
                  Delivery Partner
                </Text>
              </TouchableOpacity>
            </View>

            {loginType === 'customer' ? (
              <View style={styles.inputContainer}>
                <Feather name="phone" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 9876543210"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  svgContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  svgText: {
    fontSize: 80,
    color: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 25,
    width: '100%',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleButtonActive: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 18,
    width: '100%',
    backgroundColor: '#fefefe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 17,
    color: '#333',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
