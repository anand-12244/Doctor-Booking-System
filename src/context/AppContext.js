import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

const USER_CACHE_KEY = '@careconnect_user';

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = "https://native-g00v.onrender.com";

  const [doctors, setDoctors]   = useState([]);
  const [token, setToken]       = useState("");
  const [userData, setUserData] = useState(null);

  // ── App startup: restore token + cached user ─────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          // 1. Restore cached profile instantly (no flicker)
          const cachedRaw = await AsyncStorage.getItem(USER_CACHE_KEY);
          if (cachedRaw) {
            setUserData(JSON.parse(cachedRaw));
          }
          // 2. Set token → triggers loadUserProfileData useEffect
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Init error", e);
      }
    };
    init();
  }, []);

  // ── Fetch doctors ─────────────────────────────────────────────────────────────
  const getDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) setDoctors(data.doctors);
    } catch (error) {
      console.log("getDoctors error:", error.message);
    }
  };

  useEffect(() => { getDoctors(); }, []);

  // ── Load user profile from server ─────────────────────────────────────────────
  const loadUserProfileData = async (tkn) => {
    const activeToken = tkn || token;
    if (!activeToken) return;
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token: activeToken },
      });
      if (data.success && data.userData) {
        setUserData(data.userData);
        await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.userData));
      }
    } catch (error) {
      // network fail → keep cached data already shown
      console.log("Profile load failed:", error.message);
    }
  };

  // ── Persist userData to cache whenever it changes (from any source) ───────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (userData) {
      AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData)).catch(() => {});
    }
  }, [userData]);

  // ── Token change → fetch fresh profile ───────────────────────────────────────
  useEffect(() => {
    if (token) {
      loadUserProfileData(token);
    } else {
      setUserData(null);
      AsyncStorage.removeItem(USER_CACHE_KEY).catch(() => {});
    }
  }, [token]);

  const value = {
    doctors,
    getDoctors,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
