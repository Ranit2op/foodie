import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { formatPrice } from '../utils/pricing';

const TRACKING_STEPS = [
  { step: 1, title: 'Order Confirmed', desc: 'Your order has been received', icon: '✅', active: true },
  { step: 2, title: 'Preparing in Kitchen', desc: 'Fresh ingredients are being cooked', icon: '👨‍🍳', active: true },
  { step: 3, title: 'Delivery Partner Assigned', desc: 'Rider is on the way to pick up', icon: '🛵', active: false },
  { step: 4, title: 'Delivered', desc: 'Enjoy your delicious meal!', icon: '🍽️', active: false },
];

const OrderSuccessScreen = ({ route, navigation }) => {
  const order = route?.params?.order || {};

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Celebration Header */}
        <View style={styles.celebrationCard}>
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.celebrationTitle}>Order Placed Successfully!</Text>
          <Text style={styles.orderId}>Order ID: #{order.orderId || 'FD-100234'}</Text>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>
              Estimated Delivery: {order.estimatedDeliveryTime || '30 - 35 mins'}
            </Text>
          </View>
        </View>

        {/* Live Tracking Stepper */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛵 Live Order Status</Text>

          <View style={styles.stepperContainer}>
            {TRACKING_STEPS.map((item, index) => (
              <View key={item.step} style={styles.stepItem}>
                <View style={styles.stepIndicatorCol}>
                  <View style={[styles.stepDot, item.active && styles.stepDotActive]}>
                    <Text style={styles.stepIcon}>{item.icon}</Text>
                  </View>
                  {index < TRACKING_STEPS.length - 1 && (
                    <View style={[styles.stepLine, item.active && styles.stepLineActive]} />
                  )}
                </View>

                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, item.active && styles.stepTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={styles.stepDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Address Details */}
        {order.customer && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 Delivery To</Text>
            <Text style={styles.customerName}>{order.customer.name} ({order.customer.phone})</Text>
            <Text style={styles.customerAddress}>{order.customer.address}</Text>
            <Text style={styles.paymentMethod}>Payment: {order.customer.paymentMethod}</Text>
          </View>
        )}

        {/* Ordered Items Summary */}
        {order.items && order.items.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🍴 Items Ordered ({order.items.length})</Text>
            {order.items.map((item) => (
              <View key={item.idMeal} style={styles.itemRow}>
                <Image source={{ uri: item.strMealThumb }} style={styles.itemThumb} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.strMeal}
                  </Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
              </View>
            ))}

            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount Paid</Text>
              <Text style={styles.totalValue}>{formatPrice(order.summary?.total || 0)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => navigation.navigate('Orders')}
          activeOpacity={0.8}
        >
          <Text style={styles.ordersBtnText}>View My Orders 📦</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.homeBtnText}>Back to Home 🏠</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderSuccessScreen;

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
  celebrationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  celebrationIcon: {
    fontSize: 52,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 12,
  },
  timeBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  timeBadgeText: {
    color: '#2e7d32',
    fontSize: 13,
    fontWeight: 'bold',
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
  stepperContainer: {
    paddingLeft: 6,
  },
  stepItem: {
    flexDirection: 'row',
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 36,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  stepDotActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  stepIcon: {
    fontSize: 14,
  },
  stepLine: {
    width: 2,
    height: 36,
    backgroundColor: '#e0e0e0',
  },
  stepLineActive: {
    backgroundColor: '#4caf50',
  },
  stepContent: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#777',
  },
  stepTitleActive: {
    color: '#1a1a1a',
  },
  stepDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  customerAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  paymentMethod: {
    fontSize: 13,
    color: '#ff6b35',
    fontWeight: '600',
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  itemQty: {
    fontSize: 12,
    color: '#777',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },
  totalValue: {
    fontSize: 18,
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
    gap: 12,
    elevation: 8,
  },
  ordersBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ff6b35',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ordersBtnText: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: 'bold',
  },
  homeBtn: {
    flex: 1,
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
