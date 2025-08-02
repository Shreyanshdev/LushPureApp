import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Address } from '../../types/types';
import { addAddress, getAddresses, updateAddress, deleteAddress } from '../../src/config/api';

type NavigationProps = any; // For simplicity, using any for now

const AddressScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const storedUserId = await AsyncStorage.getItem('userId');

      if (!userToken || !storedUserId) {
        setLoading(false);
        return;
      }

      const response = await getAddresses();
      console.log("API Response:", response.data);
      setAddresses(response.data);
      console.log("Addresses State:", addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      if (!userToken || !userId) return;

      const response = await addAddress({ ...newAddress, userId });
      if (response.status === 201) {
        Alert.alert('Success', 'Address added successfully!');
        setNewAddress({
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: false,
        });
        loadAddresses();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to add address.');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address.');
    }
  };

  const handleUpdateAddress = async (addressId: string) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      if (!userToken || !userId) return;

      const response = await updateAddress(addressId, { ...newAddress, userId });
      if (response.status === 200) {
        Alert.alert('Success', 'Address updated successfully!');
        setEditingAddressId(null);
        setNewAddress({
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: false,
        });
        loadAddresses();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update address.');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address.');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) return;

      const response = await deleteAddress(addressId);
      if (response.status === 200) {
        Alert.alert('Success', 'Address deleted successfully!');
        loadAddresses();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to delete address.');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      Alert.alert('Error', 'Failed to delete address.');
    }
  };

  const handleEditPress = (address: Address) => {
    setNewAddress(address);
    setEditingAddressId(address._id);
  };

  const handleUseCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
    if (reverseGeocode.length > 0) {
      const geo = reverseGeocode[0];
      setNewAddress({
        ...newAddress,
        addressLine1: `${geo.streetNumber} ${geo.street}`,
        addressLine2: geo.name,
        city: geo.city,
        state: geo.region,
        zipCode: geo.postalCode,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Addresses</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Add New Address</Text>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#fff" />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Address Line 1"
            value={newAddress.addressLine1}
            onChangeText={(text) => setNewAddress({ ...newAddress, addressLine1: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address Line 2 (Optional)"
            value={newAddress.addressLine2}
            onChangeText={(text) => setNewAddress({ ...newAddress, addressLine2: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={newAddress.city}
            onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={newAddress.state}
            onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            value={newAddress.zipCode}
            onChangeText={(text) => setNewAddress({ ...newAddress, zipCode: text })}
          />
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setNewAddress({ ...newAddress, isDefault: !newAddress.isDefault })}
          >
            <MaterialCommunityIcons
              name={newAddress.isDefault ? "checkbox-marked" : "checkbox-blank-outline"}
              size={24}
              color="#22c55e"
            />
            <Text style={styles.checkboxLabel}>Set as Default</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={editingAddressId ? () => handleUpdateAddress(editingAddressId) : handleAddAddress}
          >
            <Text style={styles.submitButtonText}>
              {editingAddressId ? 'Update Address' : 'Add Address'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your Saved Addresses</Text>
        {addresses.length > 0 ? (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.addressCard}>
                <Text style={styles.addressText}>
                  {item.addressLine1}, {item.addressLine2 && `${item.addressLine2}, `}{item.city}, {item.state} - {item.zipCode}
                </Text>
                {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
                <View style={styles.addressActions}>
                  <TouchableOpacity onPress={() => handleEditPress(item)} style={styles.editButton}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#22c55e" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteAddress(item._id)} style={styles.deleteButton}>
                    <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noAddressText}>No addresses saved yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
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
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 15,
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  defaultBadge: {
    backgroundColor: '#22c55e',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    marginLeft: 15,
  },
  deleteButton: {
    marginLeft: 15,
  },
  noAddressText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default AddressScreen;