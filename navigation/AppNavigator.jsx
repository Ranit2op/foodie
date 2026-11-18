import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrdersScreen from '../screens/OrdersScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#ff6b35',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Details"
      component={DetailScreen}
      options={{
        title: 'Recipe Details',
      }}
    />
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{
        title: '🛒 My Cart',
      }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{
        title: 'Checkout & Delivery',
      }}
    />
    <Stack.Screen
      name="OrderSuccess"
      component={OrderSuccessScreen}
      options={{
        title: 'Order Status',
        headerBackVisible: false,
      }}
    />
    <Stack.Screen
      name="Orders"
      component={OrdersScreen}
      options={{
        title: '📦 My Orders',
      }}
    />
    <Stack.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{
        title: '❤️ My Favorites',
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
