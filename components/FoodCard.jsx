import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getMealPrice, formatPrice } from '../utils/pricing';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item, onPress }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const price = getMealPrice(item);
  const qty = getItemQuantity(item.idMeal);

  const handleAdd = (e) => {
    addToCart({ ...item, price }, 1);
  };

  const handleIncrement = () => {
    updateQuantity(item.idMeal, 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.idMeal, -1);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} resizeMode="cover" />
        {item.strCategory ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.strCategory}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.strMeal}
        </Text>

        <View style={styles.metaRow}>
          {item.strArea ? <Text style={styles.areaText}>🌍 {item.strArea}</Text> : null}
          <Text style={styles.ratingText}>⭐ 4.7 • 25-35m</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.price}>{formatPrice(price)}</Text>

          {qty === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
              <Text style={styles.addButtonText}>+ ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.stepperContainer}>
              <TouchableOpacity style={styles.stepperBtn} onPress={handleDecrement}>
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperQty}>{qty}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={handleIncrement}>
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginVertical: 8,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 170,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  areaText: {
    fontSize: 12,
    color: '#666',
  },
  ratingText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ff6b35',
  },
  addButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ff6b35',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ff6b35',
    fontSize: 13,
    fontWeight: '800',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  stepperBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  stepperQty: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
});
