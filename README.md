# 🍔 Foodie - Food Delivery & Ordering App

A modern, fast, and feature-rich Food Delivery mobile application built with **React Native**, **Expo SDK 53**, and native Android support. Powered by **TheMealDB API**.

---

## ✨ Features

- 🍕 **Explore & Search:** Browse delicious meals across multiple categories (Chicken, Seafood, Vegetarian, Pasta, Desserts, Breakfast, and more).
- 🔍 **Real-time Search:** Search dishes instantly with live search results.
- 🛒 **Cart & Pricing System:** Add/remove dishes, customize quantities (`+` / `-`), view item totals, and dynamic bill breakdown (Subtotal, Delivery Fee, Taxes).
- ⚡ **Free Delivery Perks:** Dynamic progress bar offering Free Delivery for orders above ₹499.
- 📍 **Checkout Flow:** Enter delivery address, contact details, and special delivery instructions.
- 💳 **Multiple Payment Methods:** Cash on Delivery (COD), UPI (GPay/PhonePe), and Debit/Credit Cards.
- 🛵 **Live Order Tracking:** 4-stage visual progress tracker (Order Confirmed ➔ Preparing in Kitchen ➔ Rider on the Way ➔ Delivered).
- 📦 **Order History (My Orders):** Persistent order history with 1-tap **Reorder** functionality.
- ❤️ **Favorites:** Save favorite recipes/dishes and add them directly to the cart.
- 🎨 **Modern UI/UX:** Clean theme, custom squircle brand icon, and smooth splash screen.

---

## 🛠️ Tech Stack

- **Framework:** React Native (0.79.4) & Expo SDK 53
- **Navigation:** React Navigation (Native Stack) & Expo Router
- **State Management & Persistence:** React Context API & `@react-native-async-storage/async-storage`
- **Native Platform:** Android (Gradle 8.13, Kotlin 2.0, Java 17)
- **API:** TheMealDB API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Java JDK 17 (for Android build)
- Android SDK

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/foodie.git
cd foodie

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm start
```
- Press `a` for Android Emulator / Device (via Expo Go)
- Press `w` for Web preview

---

## 📱 Build Standalone Android APK

To build the release APK directly without Expo Go:

```bash
# 1. Prebuild native android folder (if not generated)
npx expo prebuild --platform android --no-install

# 2. Build release APK
cd android
.\gradlew.bat assembleRelease
```

The output APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
