import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

const Header = ({ title = 'Foodie', onCartPress, onOrdersPress, onFavPress }) => {
  const { cartCount } = useCart();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Text style={styles.logoText}>🍔 {title}</Text>
        <Text style={styles.tagline}>Delicious food, delivered fast</Text>
      </View>

      <View style={styles.rightActions}>
        {onFavPress && (
          <TouchableOpacity style={styles.iconBtn} onPress={onFavPress} activeOpacity={0.7}>
            <Text style={styles.iconText}>❤️</Text>
          </TouchableOpacity>
        )}

        {onOrdersPress && (
          <TouchableOpacity style={styles.iconBtn} onPress={onOrdersPress} activeOpacity={0.7}>
            <Text style={styles.iconText}>📦</Text>
          </TouchableOpacity>
        )}

        {onCartPress && (
          <TouchableOpacity style={[styles.iconBtn, styles.cartBtn]} onPress={onCartPress} activeOpacity={0.7}>
            <Text style={styles.iconText}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingTop: 46,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ff6b35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  leftContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 12,
    color: '#ffe0d2',
    marginTop: 2,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  iconText: {
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#d32f2f',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
