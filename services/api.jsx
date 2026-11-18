// services/api.jsx

// TheMealDB free test API key is '1'
const API_KEY = '1';
const BASE_URL = `https://www.themealdb.com/api/json/v1/${API_KEY}`;

// Beef ফিল্টার করার হেল্পার
const filterAllowedMeals = (meals) => {
  if (!Array.isArray(meals)) return [];
  return meals.filter((meal) => {
    const category = (meal.strCategory || '').toLowerCase();
    const name = (meal.strMeal || '').toLowerCase();
    return !category.includes('beef') && !name.includes('beef');
  });
};

// খাবার বা Meal সার্চ / ডিফল্ট লিস্ট আনার API
export const fetchMeals = async (searchTerm = '') => {
  try {
    const trimmed = searchTerm.trim();
    const url = trimmed
      ? `${BASE_URL}/search.php?s=${encodeURIComponent(trimmed)}`
      : `${BASE_URL}/search.php?s=`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    return filterAllowedMeals(json.meals || []);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return [];
  }
};

// Meal ID দিয়ে বিস্তারিত তথ্য
export const fetchMealById = async (id) => {
  try {
    if (!id) return null;
    const url = `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    return json.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    return null;
  }
};

// Alias: আগের কোডের সাথে সামঞ্জস্য রাখার জন্য
export const fetchMealDetails = fetchMealById;

// নামের প্রথম অক্ষর দিয়ে Meal তালিকা
export const fetchMealsByFirstLetter = async (letter = 'a') => {
  try {
    const url = `${BASE_URL}/search.php?f=${encodeURIComponent(letter)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    return filterAllowedMeals(json.meals || []);
  } catch (error) {
    console.error('Error fetching meals by letter:', error);
    return [];
  }
};

// ক্যাটাগরি দিয়ে Meals
export const fetchMealsByCategory = async (category) => {
  if (category && category.toLowerCase().includes('beef')) {
    return [];
  }
  try {
    const url = `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    return filterAllowedMeals(json.meals || []);
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    return [];
  }
};

// সব ক্যাটাগরির তালিকা
export const fetchCategories = async () => {
  try {
    const url = `${BASE_URL}/categories.php`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    const categories = json.categories || [];
    return categories.filter((c) => !c.strCategory?.toLowerCase().includes('beef'));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
