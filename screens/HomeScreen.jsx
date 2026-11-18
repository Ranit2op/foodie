import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { fetchMeals, fetchMealsByCategory } from '../services/api';
import FoodCard from '../components/FoodCard';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/pricing';

const CATEGORIES = [
  'All',
  'Chicken',
  'Seafood',
  'Vegetarian',
  'Pasta',
  'Dessert',
  'Side',
  'Breakfast',
];

const HomeScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { cartCount, orderSummary } = useCart();

  const loadData = useCallback(async (query = '', category = 'All') => {
    let data = [];
    if (query.trim()) {
      data = await fetchMeals(query);
    } else if (category && category !== 'All') {
      data = await fetchMealsByCategory(category);
    } else {
      data = await fetchMeals('');
    }
    setMeals(data || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData(searchQuery, selectedCategory);
  }, [loadData, selectedCategory]);

  const handleSearch = () => {
    setLoading(true);
    setSelectedCategory('All');
    loadData(searchQuery, 'All');
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setLoading(true);
    loadData('', cat);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(searchQuery, selectedCategory);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Foodie"
        onCartPress={() => navigation.navigate('Cart')}
        onOrdersPress={() => navigation.navigate('Orders')}
        onFavPress={() => navigation.navigate('Favorites')}
      />

      {/* Search Input Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search pizza, burger, pasta..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setLoading(true);
                loadData('', selectedCategory);
              }}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.8}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Category Horizontal Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => handleCategorySelect(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat === 'All' ? '🍽️ All' : cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>⚡ Fast 30-Min Delivery</Text>
          <Text style={styles.bannerSubtitle}>Free delivery on orders over ₹499! Order delicious meals now.</Text>
        </View>
      </View>

      {/* Meal List */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={styles.loadingMsg}>Preparing fresh menu...</Text>
        </View>
      ) : meals.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyTitle}>No dishes found 🍳</Text>
          <Text style={styles.emptySubtitle}>Try searching for something else or pick another category.</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setLoading(true);
              loadData('', 'All');
            }}
          >
            <Text style={styles.resetBtnText}>Show All Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={[styles.listContent, cartCount > 0 && { paddingBottom: 85 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#ff6b35']} />
          }
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              onPress={() => navigation.navigate('Details', { id: item.idMeal })}
            />
          )}
        />
      )}

      {/* Floating Bottom Cart Bar (Swiggy / Zomato style) */}
      {cartCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity
            style={styles.floatingCartBar}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.9}
          >
            <View>
              <Text style={styles.floatingCartCount}>{cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'}</Text>
              <Text style={styles.floatingCartPrice}>{formatPrice(orderSummary.total)} plus taxes</Text>
            </View>
            <View style={styles.floatingCartRight}>
              <Text style={styles.floatingCartAction}>View Cart 🛒</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f8',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f4',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  clearIcon: {
    color: '#999',
    fontSize: 14,
    padding: 4,
  },
  searchBtn: {
    backgroundColor: '#ff6b35',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f2f3f5',
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: '#ff6b35',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  categoryTextActive: {
    color: '#fff',
  },
  bannerContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  banner: {
    backgroundColor: '#fff4ee',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffddce',
  },
  bannerTitle: {
    color: '#d84315',
    fontWeight: '800',
    fontSize: 13,
  },
  bannerSubtitle: {
    color: '#6d4c41',
    fontSize: 11,
    marginTop: 2,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingMsg: {
    marginTop: 12,
    color: '#666',
    fontSize: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  listContent: {
    paddingVertical: 6,
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
  },
  floatingCartBar: {
    backgroundColor: '#2e7d32',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  floatingCartCount: {
    color: '#e8f5e9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  floatingCartPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartAction: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
