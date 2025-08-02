# Gemini App Specification — Lush & Pure 🥛

## 💡 Project Overview

> The backend is already present in the `serve` folder — use it strictly and build the mobile app for it.

Build a **Blinkit-style grocery delivery mobile app** named **Lush & Pure**, using **Expo (React Native)**, connected to an existing **Fastify + MongoDB backend**, featuring:

- ✅ Phone-based login
- 🏠 Home with location + product category
- 🛒 Cart system with Razorpay integration
- 🧾 Subscription model (milk, daily delivery)
- 📍 Google Maps live delivery tracking
- 🔐 AdminJS panel already configured in backend

> ⚠️ Important: Use only **latest stable, Expo-compatible versions** of libraries for Razorpay, Google Maps, and Fastify.

---

## 📲 App Flow

### 1. **Launch & Login Screen**
- Input: Phone number
- On success: Navigate to Home screen

### 2. **Home Screen**
- Fetch and show:
  - 🌍 Location (current)
  - 🎯 Categories
  - 🛍️ Products under categories
- Background banner image
- Top right: Profile button
- Persistent cart bar at bottom: `X items in cart`

### 3. **Category & Product Navigation**
- Category sidebar like Blinkit
- Main screen: list of items under that category
- "Add to Cart" button per item
- Quantity selector

### 4. **Cart Screen**
- Product summary
- Subtotal
- Delivery fee
- Checkout button

### 5. **Razorpay Checkout**
- Integrate Razorpay (via WebView or SDK workaround for Expo)
- On payment success, call backend 
- Display confirmation screen

### 6. **Subscription Screen**
If user has no subscription:
- Show: "Buy Subscription" button
- Fields:
  - Milk type (dropdown)
  - Quantity
  - Start date
  - Slot (Morning/Evening)
- Backend handles pricing logic
- Call API `/subscriptions`

If user **has active subscription**:
- Show:
  - Active plan details
  - Cancel button (only before cutoff time)

### 7. **Order Tracking**
After order is placed:
- Show map with:
  - Delivery agent live location
  - Customer location
- Show:
  - ETA
  - Order details
  - Bill summary
  - Call delivery partner button

---

## 🛠️ Technical Requirements

### Use Expo for Development

Use the Expo framework to simplify development and ensure smooth compatibility across Android and iOS:

```bash
npx create-expo-app lush-and-pure
```

> **Do not use Tailwind/nativewind** in this project.

### Libraries to Use

- **Expo (React Native)** (latest stable)
- **React Navigation**
- **Axios** for API calls
- **Expo Location** for geolocation
- **Expo WebView** (for Razorpay if native SDK not available)
- **Expo Maps / react-native-maps**
- **AsyncStorage** (via `@react-native-async-storage/async-storage`)
- **Formik + Yup** for form validation

### Optional Integrations
- Firebase phone-based auth (Expo-compatible) for OTP
- Zustand or React Context API (based on app complexity)

---

## 📦 Output

- A fully working **Expo React Native project**
- Organized folder structure:
  - `screens/` — Launch, Home, Product, Cart, Subscription, TrackOrder
  - `components/` — Button, Card, Header, CartBar, etc.
  - `api/` — Axios clients
  - `utils/` — price calculations, date formatters
- Ready to connect to Fastify backend
- Placeholder assets for banners/images

---

## 🎯 Final Notes

- The UI/UX should mimic Blinkit and Swiggy mobile apps
- Code must be modular and scalable
- Must support both Android and iOS (via Expo Go or development builds)
- Use Expo dev tools for hot reloading and easy debugging

---

> 🧪 Gemini CLI: Please scaffold this app using Expo, exclude Tailwind/nativewind, and follow production-grade mobile UX best practices.
