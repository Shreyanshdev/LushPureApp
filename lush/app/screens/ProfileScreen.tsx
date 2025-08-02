import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getProfile, updateProfile, logout as logoutApi, getAddresses, updateAddress } from "../../src/config/api";
import { Address } from "../../types/types";

const ProfileScreen = () => {
  const navigation = useNavigation();

  // State for user data
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for edits
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUserProfile = useCallback(async () => {
    try {
      const resp = await getProfile();
      if (resp?.data) {
        const data = resp.data;
        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
      } else {
        Alert.alert("Error", "Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      Alert.alert("Error", "Failed to fetch profile data");
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      const resp = await getAddresses();
      console.log("Fetched addresses:", resp);
      if (resp?.data) {
        setAddresses(resp.data);
        const defaultAddr = resp.data.find((addr: Address) => addr.isDefault);
        if (defaultAddr) {
          setDefaultAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([fetchUserProfile(), fetchAddresses()]).finally(() => setLoading(false));
    }, [fetchUserProfile, fetchAddresses])
  );

  // Save updated profile
  async function saveProfile() {
    if (name.trim() === "") {
      Alert.alert("Validation Error", "Name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const resp = await updateProfile({ name, email });

      if (resp.status === 200 || resp.status === 201) {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
        await fetchUserProfile();
      } else {
        Alert.alert("Error", resp.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetDefaultAddress(address: Address) {
    try {
      // Set the selected address as default
      await updateAddress(address._id, { ...address, isDefault: true });

      // Unset the old default address if it exists
      if (defaultAddress && defaultAddress._id !== address._id) {
        await updateAddress(defaultAddress._id, { ...defaultAddress, isDefault: false });
      }

      setDefaultAddress(address);
      setAddressModalVisible(false);
      Alert.alert("Success", "Default address updated successfully");
    } catch (error) {
      console.error("Set default address error:", error);
      Alert.alert("Error", "Failed to update default address");
    }
  }

  // Logout handler
  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      // Ignore logout api errors
    }
    await AsyncStorage.multiRemove(["userToken", "userId", "userLoggedIn"]);
    navigation.navigate("screens/LoginScreen");
  }

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
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Personal Information */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Name */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
              placeholder="Enter your name"
              returnKeyType="done"
            />
          </View>

          {/* Email */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={email || ""}
              onChangeText={setEmail}
              editable={isEditing}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          {/* Phone - read only */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.valueText}>{profile?.phone || "N/A"}</Text>
          </View>

          {!isEditing ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setIsEditing(false);
                  // Reset inputs to original profile values if cancelled
                  setName(profile?.name || "");
                  setEmail(profile?.email || "");
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Subscription Section */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          {profile?.subscription ? (
            <>
              <Text style={styles.valueText}>
                {profile.subscription.status} - {profile.subscription.milkType} - Quantity:{" "}
                {profile.subscription.quantity}
              </Text>
              <Text style={styles.valueText}>
                Slot: {profile.subscription.slot}
              </Text>
              <Text style={styles.valueText}>
                Start: {new Date(profile.subscription.startDate).toDateString()}
              </Text>
              <Text style={styles.valueText}>
                End: {new Date(profile.subscription.endDate).toDateString()}
              </Text>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("screens/SubscriptionScreen")}
              >
                <Text style={styles.actionButtonText}>Manage Subscription</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.valueText}>No active subscription.</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("screens/SubscriptionScreen")}
              >
                <Text style={styles.actionButtonText}>Buy Subscription</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Delivery Address Section */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {defaultAddress ? (
            <Text style={styles.valueText}>
              {defaultAddress.addressLine1}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.zipCode}
            </Text>
          ) : (
            <Text style={styles.valueText}>No default address set.</Text>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setAddressModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Change Default Address</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("screens/AddressScreen")}
          >
            <Text style={styles.actionButtonText}>Manage Addresses</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Address Selection Modal */}
      <Modal
        visible={isAddressModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Default Address</Text>
            <FlatList
              data={addresses}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.addressOption}
                  onPress={() => handleSetDefaultAddress(item)}
                >
                  <Text style={styles.addressText}>
                    {item.addressLine1}, {item.city}, {item.state} - {item.zipCode}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f8f8" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },

  container: { flex: 1, padding: 16 },

  profileSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  inputRow: {
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  },

  input: {
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },

  valueText: {
    fontSize: 16,
    color: "#333",
  },

  editBtn: {
    marginTop: 8,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  editBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  saveBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  actionButton: {
    marginTop: 10,
    backgroundColor: "#e6ffe6",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#22c55e",
  },

  actionButtonText: {
    color: "#22c55e",
    fontWeight: "bold",
  },

  logoutButton: {
    marginTop: 20,
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  addressOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  addressText: {
    fontSize: 16,
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
