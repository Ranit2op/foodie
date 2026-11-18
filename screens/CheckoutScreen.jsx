import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/pricing';
import { createOrder } from '../utils/orderStorage';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery (COD)', icon: '💵', desc: 'Pay with cash or UPI when delivered' },
  { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)', icon: '📱', desc: 'Fast, secure instant payment' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, MasterCard, RuPay' },
];

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, orderSummary, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Required Field', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Required Field', 'Please enter your delivery address.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty!');
      navigation.navigate('Home');
      return;
    }

    setSubmitting(true);
    try {
      const selectedPayment = PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label;
      const order = await createOrder({
        items: cartItems,
        summary: orderSummary,
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          paymentMethod: selectedPayment,
          instructions: instructions.trim(),
        },
      });

      // Clear cart
      clearCart();

      // Navigate to Order Success Screen
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'OrderSuccess', params: { order } }],
      });
    } catch (err) {
      Alert.alert('Order Failed', 'Could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Address Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Delivery Details</Text>

          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rahul Sharma"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>Delivery Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="House / Flat No., Landmark, Street, City"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.inputLabel}>Delivery Instructions (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Leave at door, don't ring bell"
            placeholderTextColor="#999"
            value={instructions}
            onChangeText={setInstructions}
          />
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💳 Payment Method</Text>

          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                onPress={() => setPaymentMethod(method.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>{method.label}</Text>
                  <Text style={styles.paymentDesc}>{method.desc}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Text style={styles.summaryValue}>{cartItems.length} dishes</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              {orderSummary.deliveryFee === 0 ? 'FREE' : formatPrice(orderSummary.deliveryFee)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{formatPrice(orderSummary.total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.barLabel}>Total Payable</Text>
          <Text style={styles.barTotal}>{formatPrice(orderSummary.total)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, submitting && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderBtnText}>Place Order ➔</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 95,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 5,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  paymentOptionSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#fff8f5',
  },
  paymentIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  paymentDesc: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#ff6b35',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff6b35',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ff6b35',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#777',
    textTransform: 'uppercase',
  },
  barTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ff6b35',
  },
  placeOrderBtn: {
    backgroundColor: '#2e7d32',
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 10,
    minWidth: 160,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  placeOrderBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
