import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/pricing';

const CartScreen = ({ navigation }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, orderSummary } = useCart();

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty!</Text>
        <Text style={styles.emptySubtitle}>
          Looks like you haven't added anything to your cart yet. Explore our delicious menu!
        </Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.browseBtnText}>Explore Delicious Food</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Free Delivery Banner */}
        <View style={styles.deliveryBanner}>
          {orderSummary.deliveryFee === 0 ? (
            <Text style={styles.freeDeliveryText}>🎉 Yay! You have unlocked FREE Delivery!</Text>
          ) : (
            <Text style={styles.deliveryPromoText}>
              Add {formatPrice(orderSummary.amountNeededForFreeDelivery)} more for <Text style={styles.bold}>FREE Delivery</Text>!
            </Text>
          )}
        </View>

        {/* Cart Items List */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selected Items ({cartItems.length})</Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {cartItems.map((item) => (
            <View key={item.idMeal} style={styles.itemRow}>
              <Image source={{ uri: item.strMealThumb }} style={styles.itemImage} />

              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.strMeal}
                </Text>
                <Text style={styles.itemPrice}>{formatPrice(item.price)} each</Text>
              </View>

              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => updateQuantity(item.idMeal, -1)}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperQty}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => updateQuantity(item.idMeal, 1)}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addMoreBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <Text style={styles.addMoreText}>+ Add More Dishes</Text>
          </TouchableOpacity>
        </View>

        {/* Bill Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>{formatPrice(orderSummary.subtotal)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            {orderSummary.deliveryFee === 0 ? (
              <Text style={styles.freeText}>FREE</Text>
            ) : (
              <Text style={styles.billValue}>{formatPrice(orderSummary.deliveryFee)}</Text>
            )}
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Restaurant Charges (5%)</Text>
            <Text style={styles.billValue}>{formatPrice(orderSummary.tax)}</Text>
          </View>

          <View style={[styles.billRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>To Pay</Text>
            <Text style={styles.grandTotalValue}>{formatPrice(orderSummary.total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.barLabel}>Total Amount</Text>
          <Text style={styles.barTotal}>{formatPrice(orderSummary.total)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

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
    paddingBottom: 90,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  browseBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deliveryBanner: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  freeDeliveryText: {
    color: '#2e7d32',
    fontSize: 13,
    fontWeight: '700',
  },
  deliveryPromoText: {
    color: '#2e7d32',
    fontSize: 13,
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
  },
  clearText: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  itemPrice: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b35',
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  stepperBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  stepperBtnText: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  stepperQty: {
    paddingHorizontal: 6,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1a1a',
    minWidth: 55,
    textAlign: 'right',
  },
  addMoreBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  addMoreText: {
    color: '#ff6b35',
    fontSize: 13,
    fontWeight: '700',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 13,
    color: '#666',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  freeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2e7d32',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 10,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  grandTotalValue: {
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
  checkoutBtn: {
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
