import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, removeFavorite } from '../utils/storage';
import { getMealPrice, formatPrice } from '../utils/pricing';
import { useCart } from '../context/CartContext';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data || []);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleRemove = (item) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${item.strMeal} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = await removeFavorite(item.idMeal);
            setFavorites(updated);
          },
        },
      ]
    );
  };

  const handleAddToCart = (item) => {
    const price = getMealPrice(item);
    addToCart({ ...item, price }, 1);
    Alert.alert('Added to Cart! 🛒', `${item.strMeal} added to your cart.`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={styles.emptyTitle}>No favorite meals yet!</Text>
        <Text style={styles.emptySubtitle}>
          Save dishes you love by tapping the heart icon on any recipe.
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.browseButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const price = getMealPrice(item);
          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardTouchable}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Details', { id: item.idMeal })}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.strMeal}
                  </Text>
                  <Text style={styles.price}>{formatPrice(price)}</Text>
                  {item.strCategory ? (
                    <Text style={styles.categoryText}>🏷️ {item.strCategory}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              <View style={styles.actionsCol}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemove(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => handleAddToCart(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addCartBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  browseButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContent: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 85,
    height: 85,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ff6b35',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#777',
  },
  actionsCol: {
    paddingRight: 10,
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  addCartBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ff6b35',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  addCartBtnText: {
    color: '#ff6b35',
    fontSize: 12,
    fontWeight: '800',
  },
});
