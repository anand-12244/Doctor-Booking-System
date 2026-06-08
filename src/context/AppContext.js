import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AppContext = createContext();

const USER_CACHE_KEY = "@careconnect_user";

const AppContextProvider = (props) => {
  const currencySymbol = "$";

  const backendUrl = "http://localhost:3000";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const cachedRaw = await AsyncStorage.getItem(USER_CACHE_KEY);
          if (cachedRaw) {
            setUserData(JSON.parse(cachedRaw));
          }
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Init error", e);
      }
    };
    init();
  }, []);

  // ── Fetch doctors from json-server ─────

  const getDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/doctors");
      setDoctors(data);
    } catch (error) {
      console.log("getDoctors error:", error.message);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // ── Load user profile from server ─────────────────────────────────────────
  const loadUserProfileData = async (tkn) => {
    const activeToken = tkn || token;
    if (!activeToken) return;

    try {
      const { data } = await axios.get(backendUrl + `/users/${activeToken}`);
      if (data) {
        const user = { ...data };
        delete user.password;
        setUserData(user);
        await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.log("Profile load failed:", error.message);
    }
  };

  // ── Persist userData to AsyncStorage when it changes ──────────────────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (userData) {
      AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData)).catch(
        () => {},
      );
    }
  }, [userData]);

  // ── Token change  fetch fresh profile ───────────────────────────────────
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
    userId: token, 
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
