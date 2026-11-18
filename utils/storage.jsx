import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export const saveFavorite = async (meal) => {
  try {
    if (!meal || !meal.idMeal) return false;
    const existing = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = existing ? JSON.parse(existing) : [];
    const exists = favorites.some((item) => item.idMeal === meal.idMeal);
    if (!exists) {
      favorites.push(meal);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    }
    return false; // already saved
  } catch (error) {
    console.error('Error saving favorite:', error);
    return false;
  }
};

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const removeFavorite = async (idMeal) => {
  try {
    const existing = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = existing ? JSON.parse(existing) : [];
    const updated = favorites.filter((item) => item.idMeal !== idMeal);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return [];
  }
};

export const isFavorite = async (idMeal) => {
  try {
    const existing = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = existing ? JSON.parse(existing) : [];
    return favorites.some((item) => item.idMeal === idMeal);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};
