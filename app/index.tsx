import React from 'react';
import AppNavigator from '../navigation/AppNavigator';
import { CartProvider } from '../context/CartContext';

export default function Index() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}
