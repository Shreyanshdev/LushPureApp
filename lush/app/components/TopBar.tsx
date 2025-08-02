import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { getAddresses, updateAddress } from '../../src/config/api';
import { Address } from '../../types/types';

type RootStackParamList = {
  'screens/ProfileScreen': undefined;
};
type NavigationProps = any;

const { height: screenHeight } = Dimensions.get('window');

const TopBar = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Fetching location...');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const resp = await getAddresses();
      if (resp?.data) {
        setAddresses(resp.data);
        const defaultAddr = resp.data.find((addr: Address) => addr.isDefault);
        if (defaultAddr) {
          setDefaultAddress(defaultAddr);
          setCurrentLocation(`${defaultAddr.addressLine1}, ${defaultAddr.city}`);
        }
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses])
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleUseCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setCurrentLocation('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    let address = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address.length > 0) {
      const { street, city, region } = address[0];
      setCurrentLocation(`${street}, ${city}, ${region}`);
    }
    setModalVisible(false);
  };

  const handleSelectAddress = async (address: Address) => {
    try {
      await updateAddress(address._id, { ...address, isDefault: true });
      if (defaultAddress && defaultAddress._id !== address._id) {
        await updateAddress(defaultAddress._id, { ...defaultAddress, isDefault: false });
      }
      setDefaultAddress(address);
      setCurrentLocation(`${address.addressLine1}, ${address.city}`);
      setModalVisible(false);
    } catch (error) {
      console.error("Set default address error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <TouchableOpacity style={styles.locationContainer} onPress={toggleModal}>
          <Feather name="map-pin" size={20} color="#333" />
          <Text style={styles.locationText}>{currentLocation}</Text>
        </TouchableOpacity>

        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.profileIconContainer} onPress={() => navigation.navigate('screens/ProfileScreen')}>
            <Feather name="user" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <BlurView intensity={20} tint="dark" style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} onPress={toggleModal} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Delivery Location</Text>

            <TouchableOpacity style={styles.modalOptionButton} onPress={handleUseCurrentLocation}>
              <Feather name="crosshair" size={20} color="#22c55e" />
              <Text style={styles.modalOptionText}>Use Current Location</Text>
            </TouchableOpacity>

            <FlatList
              data={addresses}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.addressOption}
                  onPress={() => handleSelectAddress(item)}
                >
                  <Text style={styles.addressText}>
                    {item.addressLine1}, {item.city}, {item.state} - {item.zipCode}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  topContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: screenHeight * 0.5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  modalOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
  },
  addressOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  addressText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TopBar;