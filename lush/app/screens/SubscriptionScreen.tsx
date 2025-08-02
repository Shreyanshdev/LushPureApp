import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Platform, Alert, ScrollView, Modal } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RadioButton from '../components/RadioButton';
import { Subscription } from '../../types/types';
import { createSubscription, getSubscription, cancelSubscription } from '../../src/config/api';

const SubscriptionSchema = Yup.object().shape({
  milkType: Yup.string().required('Milk Type is required'),
  animal: Yup.string().required('Animal is required'),
  quantity: Yup.string().required('Quantity is required'),
  startDate: Yup.date()
    .required('Start Date is required')
    .min(new Date(), 'Start Date cannot be in the past'),
  slot: Yup.string().required('Slot is required'),
});

const milkTypes = ['Full Toned', 'Butter Milk'];
const animals = ['Cow', 'Buffalo'];
const quantities = ['500 ml', '1 L', '1.5 L', '2 L'];
const slots = ['Morning', 'Evening'];

const milkPrices = {
  'Buffalo': {
    '500 ml': 35,
    '1 L': 70,
    '1.5 L': 105,
    '2 L': 140,
  },
  'Cow': {
    '500 ml': 29,
    '1 L': 58,
    '1.5 L': 87,
    '2 L': 116,
  },
};

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [calculatedBill, setCalculatedBill] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (userId) {
        try {
          const response = await getSubscription(userId);
          const data: Subscription = response.data;
          setActiveSubscription(data);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
    };
    fetchSubscription();
  }, []);

  const calculateBill = (values: any) => {
    const { animal, quantity } = values;
  
    const price =
      milkPrices?.[animal as keyof typeof milkPrices]?.[
        quantity as keyof (typeof milkPrices)[keyof typeof milkPrices]
      ];
  
    if (price) {
      setCalculatedBill(price * 30); // Monthly bill
    } else {
      setCalculatedBill(0);
    }
  };

  const handleCreateSubscription = async (values: Subscription) => {
    try {
      const response = await createSubscription({ ...values, userId, bill: calculatedBill });
      const data: Subscription = response.data;
      setActiveSubscription(data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error creating subscription:', error);
      Alert.alert('Error', 'Failed to create subscription.');
    }
  };

  const handleCancelSubscription = async () => {
    if (activeSubscription && activeSubscription.id) {
      try {
        await cancelSubscription(activeSubscription.id);
        setActiveSubscription(null);
        Alert.alert('Success', 'Subscription cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        Alert.alert('Error', 'Failed to cancel subscription.');
      }
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    setFieldValue('startDate', date);
    hideDatePicker();
  };

  if (activeSubscription) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Subscription</Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Milk Type:</Text>
            <Text style={styles.detailValue}>{activeSubscription.milkType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Animal:</Text>
            <Text style={styles.detailValue}>{activeSubscription.animal}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{activeSubscription.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>{new Date(activeSubscription.startDate).toDateString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Slot:</Text>
            <Text style={styles.detailValue}>{activeSubscription.slot}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Bill:</Text>
            <Text style={styles.detailValue}>₹{activeSubscription.bill}</Text>
          </View>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
            <Text style={styles.cancelButton}>Cancel Subscription</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a Subscription</Text>
      </View>
      <ScrollView style={styles.container}>
        <Formik
          initialValues={{
            milkType: milkTypes[0],
            animal: animals[0],
            quantity: quantities[0],
            startDate: new Date(),
            slot: slots[0],
            userId: "",
            bill: 0
          }}
          validationSchema={SubscriptionSchema}
          onSubmit={handleCreateSubscription}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Milk Type</Text>
              <View style={styles.radioGroup}>
                {milkTypes.map((type) => (
                  <RadioButton
                    key={type}
                    label={type}
                    value={type}
                    selectedValue={values.milkType}
                    onPress={(value) => {
                      setFieldValue('milkType', value);
                      calculateBill({ ...values, milkType: value });
                    }}
                  />
                ))}
              </View>
              {errors.milkType && touched.milkType ? <Text style={styles.errorText}>{errors.milkType}</Text> : null}

              <Text style={styles.label}>Animal</Text>
              <View style={styles.radioGroup}>
                {animals.map((animal) => (
                  <RadioButton
                    key={animal}
                    label={animal}
                    value={animal}
                    selectedValue={values.animal}
                    onPress={(value) => {
                      setFieldValue('animal', value);
                      calculateBill({ ...values, animal: value });
                    }}
                  />
                ))}
              </View>
              {errors.animal && touched.animal ? <Text style={styles.errorText}>{errors.animal}</Text> : null}

              <Text style={styles.label}>Quantity</Text>
              <View style={styles.radioGroup}>
                {quantities.map((qty) => (
                  <RadioButton
                    key={qty}
                    label={qty}
                    value={qty}
                    selectedValue={values.quantity}
                    onPress={(value) => {
                      setFieldValue('quantity', value);
                      calculateBill({ ...values, quantity: value });
                    }}
                  />
                ))}
              </View>
              {errors.quantity && touched.quantity ? <Text style={styles.errorText}>{errors.quantity}</Text> : null}

              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                <Text style={styles.datePickerButtonText}>
                  {values.startDate ? values.startDate.toDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => handleConfirmDate(date, setFieldValue)}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
              />
              {errors.startDate && touched.startDate ? (
                <Text style={styles.errorText}>
                  {String(errors.startDate)}
                </Text>
              ) : null}
              <Text style={styles.label}>Slot</Text>
              <View style={styles.radioGroup}>
                {slots.map((slot) => (
                  <RadioButton
                    key={slot}
                    label={slot}
                    value={slot}
                    selectedValue={values.slot}
                    onPress={(value) => {
                      setFieldValue('slot', value);
                      calculateBill({ ...values, slot: value });
                    }}
                  />
                ))}
              </View>
              <Text style={styles.slotDescription}>Morning slot: 6 AM - 9 AM, Evening slot: 6 PM - 9 PM</Text>
              {errors.slot && touched.slot ? <Text style={styles.errorText}>{errors.slot}</Text> : null}

              <Text style={styles.billText}>Estimated Monthly Bill: ₹{calculatedBill}</Text>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  calculateBill(values);
                  handleSubmit();
                }}
              >
                <Text style={styles.submitButtonText}>Subscribe Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Subscription Confirmed!</Text>
            <Text style={styles.modalText}>
              Your subscription is valid for 45 days, during which you will receive 30 days of delivery.
            </Text>
            <Text style={styles.modalText}>
              You can pause delivery for a particular day by deactivating delivery two hours before your preferred time slot.
            </Text>
            <Text style={styles.modalText}>
              Time slots are flexible, and you can change them according to your needs.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
    marginTop: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 50,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ff3333',
    fontSize: 12,
    marginBottom: 5,
  },
  billText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22c55e',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  slotDescription: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#22c55e',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen;
