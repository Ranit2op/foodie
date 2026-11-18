import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchMealById } from '../services/api';
import { saveFavorite, removeFavorite, isFavorite } from '../utils/storage';
import { getMealPrice, formatPrice } from '../utils/pricing';
import { useCart } from '../context/CartContext';

const DetailScreen = ({ route, navigation }) => {
  const mealId = route?.params?.id;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!mealId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      const [fetchedMeal, favStatus] = await Promise.all([
        fetchMealById(mealId),
        isFavorite(mealId),
      ]);
      if (isMounted) {
        setMeal(fetchedMeal);
        setFavorite(favStatus);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [mealId]);

  const price = meal ? getMealPrice(meal) : 199;

  const handleAddToCart = () => {
    if (!meal) return;
    addToCart({ ...meal, price }, quantity);
    Alert.alert('Added to Cart! 🛒', `${quantity}x ${meal.strMeal} added to your cart.`);
  };

  const handleOrderNow = () => {
    if (!meal) return;
    addToCart({ ...meal, price }, quantity);
    navigation.navigate('Cart');
  };

  const toggleFavorite = async () => {
    if (!meal) return;
    if (favorite) {
      await removeFavorite(meal.idMeal);
      setFavorite(false);
      Alert.alert('Removed', `${meal.strMeal} removed from favorites.`);
    } else {
      await saveFavorite(meal);
      setFavorite(true);
      Alert.alert('Saved! ❤️', `${meal.strMeal} added to favorites.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading recipe details...</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Could not find meal details.</Text>
      </View>
    );
  }

  // Extract ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} resizeMode="cover" />

        <View style={styles.infoCard}>
          <Text style={styles.title}>{meal.strMeal}</Text>

          <View style={styles.metaRow}>
            {meal.strCategory && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🏷️ {meal.strCategory}</Text>
              </View>
            )}
            {meal.strArea && (
              <View style={[styles.badge, styles.areaBadge]}>
                <Text style={styles.badgeText}>🌍 {meal.strArea}</Text>
              </View>
            )}
            <View style={[styles.badge, styles.ratingBadge]}>
              <Text style={styles.badgeText}>⭐ 4.8 (120+ reviews)</Text>
            </View>
          </View>

          {/* Pricing & Quantity Row */}
          <View style={styles.pricingSection}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>{formatPrice(price)}</Text>
            </View>

            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperQty}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.totalCalc}>
              <Text style={styles.priceLabel}>Item Total</Text>
              <Text style={styles.itemTotal}>{formatPrice(price * quantity)}</Text>
            </View>
          </View>

          {/* Favorite Toggle Button */}
          <TouchableOpacity
            style={[styles.favButton, favorite && styles.favButtonActive]}
            onPress={toggleFavorite}
            activeOpacity={0.8}
          >
            <Text style={[styles.favButtonText, favorite && styles.favButtonTextActive]}>
              {favorite ? '❤️ Saved in Favorites (Tap to Remove)' : '🤍 Add to Favorites'}
            </Text>
          </TouchableOpacity>

          {/* Ingredients Section */}
          {ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fresh Ingredients ({ingredients.length})</Text>
              <View style={styles.ingredientsList}>
                {ingredients.map((item, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.ingredientText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Instructions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipe & Preparation</Text>
            <Text style={styles.instructionsText}>
              {meal.strInstructions || 'Authentic restaurant-style meal prepared fresh on order.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Ordering Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Text style={styles.addToCartText}>+ Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderNowBtn}
          onPress={handleOrderNow}
          activeOpacity={0.85}
        >
          <Text style={styles.orderNowText}>Order Now ⚡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  image: {
    width: '100%',
    height: 260,
  },
  infoCard: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  areaBadge: {
    backgroundColor: '#e8f5e9',
  },
  ratingBadge: {
    backgroundColor: '#e3f2fd',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  pricingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 11,
    color: '#777',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ff6b35',
  },
  itemTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2e7d32',
  },
  totalCalc: {
    alignItems: 'flex-end',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ff6b35',
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  stepperBtnText: {
    color: '#ff6b35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepperQty: {
    fontSize: 15,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
    color: '#222',
  },
  favButton: {
    paddingVertical: 12,
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 20,
  },
  favButtonActive: {
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
  },
  favButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
  },
  favButtonTextActive: {
    color: '#d32f2f',
  },
  section: {
    marginTop: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  ingredientsList: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    color: '#ff6b35',
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
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
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ff6b35',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#ff6b35',
    fontSize: 15,
    fontWeight: 'bold',
  },
  orderNowBtn: {
    flex: 1,
    backgroundColor: '#ff6b35',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderNowText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
