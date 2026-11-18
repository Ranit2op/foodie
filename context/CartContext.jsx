import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMealPrice, calculateOrderSummary } from '../utils/pricing';

const CART_KEY = '@foodie_cart_v1';
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved cart from AsyncStorage on startup
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_KEY);
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save cart whenever it updates
  const persistCart = async (newItems) => {
    setCartItems(newItems);
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(newItems));
    } catch (err) {
      console.error('Error saving cart:', err);
    }
  };

  const addToCart = (meal, quantity = 1) => {
    if (!meal || !meal.idMeal) return;
    const price = meal.price || getMealPrice(meal.idMeal);
    const existingIndex = cartItems.findIndex((item) => item.idMeal === meal.idMeal);

    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
    } else {
      updated = [
        ...cartItems,
        {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory || '',
          price,
          quantity,
        },
      ];
    }
    persistCart(updated);
  };

  const removeFromCart = (idMeal) => {
    const updated = cartItems.filter((item) => item.idMeal !== idMeal);
    persistCart(updated);
  };

  const updateQuantity = (idMeal, delta) => {
    const updated = cartItems
      .map((item) => {
        if (item.idMeal === idMeal) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    persistCart(updated);
  };

  const clearCart = () => {
    persistCart([]);
  };

  const getItemQuantity = (idMeal) => {
    const item = cartItems.find((i) => i.idMeal === idMeal);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const orderSummary = calculateOrderSummary(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        orderSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
