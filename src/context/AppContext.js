import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
 const [products] = useState([
  // Pastries
  { id: 1, name: "Plain Croissant", price: 100, image: require("../assets/images/pastry1.jpeg"), category: "Pastries" },
  { id: 2, name: "Cinnamon Roll", price: 120, image: require("../assets/images/pastry2.jpeg"), category: "Pastries" },
  { id: 3, name: "Soft Pretzels", price: 90, image: require("../assets/images/pastry3.jpeg"), category: "Pastries" },
  { id: 4, name: "Choco Cookie", price: 110, image: require("../assets/images/pastry4.jpeg"), category: "Pastries" },
  { id: 5, name: "Berry Donut", price: 130, image: require("../assets/images/pastry5.jpeg"), category: "Pastries" },
  { id: 6, name: "Pain de Campagne", price: 140, image: require("../assets/images/pastry6.jpeg"), category: "Pastries" },

  // Beverages
  { id: 7, name: "H2O", price: 80, image: require("../assets/images/drink1.jpeg"), category: "Beverages" },
  { id: 8, name: "Berry Cookie Milkshake", price: 95, image: require("../assets/images/drink2.jpeg"), category: "Beverages" },
  { id: 9, name: "Choco Caramelize Milkshake", price: 70, image: require("../assets/images/drink3.jpeg"), category: "Beverages" },
  { id: 10, name: "Classic Blub Milktea", price: 105, image: require("../assets/images/drink4.jpeg"), category: "Beverages" },
  { id: 11, name: "Fresh H2O", price: 70, image: require("../assets/images/drink5.jpeg"), category: "Beverages" },
  { id: 12, name: "Iced Lemonade", price: 105, image: require("../assets/images/drink6.jpeg"), category: "Beverages" },
]);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // ====================== LOAD DATA ======================
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        const savedWishlist = await AsyncStorage.getItem('wishlist');
        const savedHistory = await AsyncStorage.getItem('history');
        const savedDarkMode = await AsyncStorage.getItem('darkMode');

        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
      } catch (e) {
        console.log("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  // ====================== SAVE DATA ======================
  useEffect(() => {
    const saveCart = async () => {
      try { await AsyncStorage.setItem('cart', JSON.stringify(cart)); } 
      catch (e) { console.log("Failed to save cart", e); }
    };
    saveCart();
  }, [cart]);

  useEffect(() => {
    const saveWishlist = async () => {
      try { await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist)); } 
      catch (e) { console.log("Failed to save wishlist", e); }
    };
    saveWishlist();
  }, [wishlist]);

  useEffect(() => {
    const saveHistory = async () => {
      try { 
        await AsyncStorage.setItem('history', JSON.stringify(history)); 
        console.log("History saved:", history.length, "items"); // debug
      } 
      catch (e) { console.log("Failed to save history", e); }
    };
    saveHistory();
  }, [history]);

  useEffect(() => {
    const saveDarkMode = async () => {
      try { await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode)); } 
      catch (e) { console.log("Failed to save darkMode", e); }
    };
    saveDarkMode();
  }, [darkMode]);

  // ====================== HELPER FUNCTIONS ======================
  const toggleDark = () => setDarkMode(prev => !prev);

  const toggleWishlist = (item) => {
    setWishlist(prev => {
      const exists = prev.some((p) => p.id === item.id);
      return exists 
        ? prev.filter((p) => p.id !== item.id) 
        : [...prev, item];
    });
  };

  const isInWishlist = (id) => wishlist.some((p) => p.id === id);

  const generateID = () => {
    return `TRX-${Date.now().toString().slice(-8)}`;
  };

  return (
    <AppContext.Provider value={{
      products,
      cart, 
      setCart,
      wishlist, 
      setWishlist,
      toggleWishlist,
      isInWishlist,
      history, 
      setHistory,
      darkMode, 
      toggleDark,
      generateID,
    }}>
      {children}
    </AppContext.Provider>
  );
};