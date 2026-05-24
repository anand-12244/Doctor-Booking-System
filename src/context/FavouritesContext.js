import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavouritesContext = createContext();

const STORAGE_KEY = '@careconnect_favourites';

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  // Load saved favourites on mount
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setFavourites(JSON.parse(saved));
      } catch (_) {}
    };
    load();
  }, []);

  // Persist whenever favourites change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favourites)).catch(() => {});
  }, [favourites]);

  const isFavourite = (docId) => favourites.includes(docId);

  const toggleFavourite = (docId) => {
    setFavourites(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};
