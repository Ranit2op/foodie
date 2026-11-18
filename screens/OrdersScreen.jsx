import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getOrders } from '../utils/orderStorage';
import { formatPrice } from '../utils/pricing';
import { useCart } from '../context/CartContext';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data || []);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const handleReorder = (order) => {
    if (!order.items) return;
    order.items.forEach((item) => {
      addToCart(item, item.quantity || 1);
    });
    navigation.navigate('Cart');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No past orders yet!</Text>
        <Text style={styles.emptySubtitle}>
          You haven't placed any orders yet. Treat yourself with delicious meals from Foodie!
        </Text>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.exploreBtnText}>Explore Menu 🍔</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>Order #{item.orderId}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>● {item.status}</Text>
              </View>
            </View>

            <View style={styles.itemsPreview}>
              {item.items.map((meal) => (
                <View key={meal.idMeal} style={styles.mealRow}>
                  <Image source={{ uri: meal.strMealThumb }} style={styles.mealThumb} />
                  <Text style={styles.mealName} numberOfLines={1}>
                    {meal.quantity}x {meal.strMeal}
                  </Text>
                  <Text style={styles.mealPrice}>{formatPrice(meal.price * meal.quantity)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.totalLabel}>Total Paid</Text>
                <Text style={styles.totalAmount}>{formatPrice(item.summary?.total || 0)}</Text>
              </View>

              <TouchableOpacity
                style={styles.reorderBtn}
                onPress={() => handleReorder(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.reorderBtnText}>↻ Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  listContent: {
    padding: 14,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 56,
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
  exploreBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '700',
  },
  itemsPreview: {
    paddingVertical: 10,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  mealThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  mealName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  mealPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
  },
  totalLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ff6b35',
  },
  reorderBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ff6b35',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reorderBtnText: {
    color: '#ff6b35',
    fontSize: 13,
    fontWeight: '700',
  },
});
