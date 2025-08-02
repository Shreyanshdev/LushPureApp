// src/components/TopBar.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { BlurView } from 'expo-blur';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import * as Location from 'expo-location';
type RootStackParamList = {
  'screens/ProfileScreen': undefined;
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const { height: screenHeight } = Dimensions.get('window');

// Removed React.FC for cleaner component definition


const TopBar = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Fetching location...');
  const [savedAddress, setSavedAddress] = useState('');

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleUseCurrentLocation = () => {
    setCurrentLocation('Your Current Location');
    setModalVisible(false);
  };

  const handleSelectAddress = () => {
    if (savedAddress.trim() !== '') {
      setCurrentLocation(savedAddress.trim());
      setModalVisible(false);
    } else {
      alert('Please enter a saved address or use current location.');
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

            <View style={styles.savedAddressContainer}>
              <Feather name="home" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.savedAddressInput}
                placeholder="Enter Saved Address"
                placeholderTextColor="#9ca3af"
                value={savedAddress}
                onChangeText={setSavedAddress}
              />
            </View>

            <TouchableOpacity style={styles.modalOkButton} onPress={handleSelectAddress}>
              <Text style={styles.modalOkButtonText}>OK</Text>
            </TouchableOpacity>
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
  savedAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f9fafb',
  },
  inputIcon: {
    marginRight: 10,
  },
  savedAddressInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  modalOkButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalOkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TopBar;