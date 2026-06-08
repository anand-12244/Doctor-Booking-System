import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "./AppContext";

export const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const { token } = useContext(AppContext); // token is userId
  const [favourites, setFavourites] = useState([]);

  // Generate user-specific storage key
  const getStorageKey = (userId) => `@careconnect_favourites_${userId}`;

  useEffect(() => {
    const load = async () => {
      try {
        if (token) {
          const storageKey = getStorageKey(token);
          const saved = await AsyncStorage.getItem(storageKey);
          if (saved) {
            setFavourites(JSON.parse(saved));
          } else {
            setFavourites([]);
          }
        } else {
          // No user logged in
          setFavourites([]);
        }
      } catch (_) {
        setFavourites([]);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (token) {
      const storageKey = getStorageKey(token);
      AsyncStorage.setItem(storageKey, JSON.stringify(favourites)).catch(
        () => {},
      );
    }
  }, [favourites, token]);

  const isFavourite = (docId) => favourites.includes(docId);

  const toggleFavourite = (docId) => {
    if (!token) {
      console.warn("User must be logged in to add favourites");
      return;
    }
    setFavourites((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, isFavourite, toggleFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
