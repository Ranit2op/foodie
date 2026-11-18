import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_KEY = '@foodie_orders_v1';

export const createOrder = async ({ items, summary, customer }) => {
  try {
    const existingStr = await AsyncStorage.getItem(ORDERS_KEY);
    const existingOrders = existingStr ? JSON.parse(existingStr) : [];

    const orderId = `FD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const estTime = new Date(now.getTime() + 35 * 60000); // 35 mins from now

    const newOrder = {
      orderId,
      createdAt: now.toISOString(),
      estimatedDeliveryTime: estTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed', // Confirmed, Preparing, On the Way, Delivered
      items: items.map((i) => ({
        idMeal: i.idMeal,
        strMeal: i.strMeal,
        strMealThumb: i.strMealThumb,
        price: i.price,
        quantity: i.quantity,
      })),
      summary: {
        subtotal: summary.subtotal,
        deliveryFee: summary.deliveryFee,
        tax: summary.tax,
        total: summary.total,
      },
      customer: {
        name: customer.name || 'Foodie Customer',
        phone: customer.phone || '',
        address: customer.address || '',
        paymentMethod: customer.paymentMethod || 'Cash on Delivery',
        instructions: customer.instructions || '',
      },
    };

    const updatedOrders = [newOrder, ...existingOrders];
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const data = await AsyncStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const getOrderById = async (orderId) => {
  try {
    const orders = await getOrders();
    return orders.find((o) => o.orderId === orderId) || null;
  } catch (error) {
    console.error('Error finding order:', error);
    return null;
  }
};
