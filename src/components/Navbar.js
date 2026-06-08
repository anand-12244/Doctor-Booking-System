import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Pressable,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppContext } from "../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_W } = Dimensions.get("window");
const PRIMARY = "#5f6FFF";

const NavLogo = ({ size = 22 }) => (
  <Text style={[styles.logoText, { fontSize: size }]}>
    <Text style={{ color: PRIMARY }}>Care</Text>
    <Text style={{ color: "#1F2937" }}>Connect</Text>
  </Text>
);

const NAV_LINKS = [
  { label: "Home", route: "Home" },
  { label: "All Doctors", route: "Doctors" },
  { label: "AI Symptom Checker 🤖", route: "SymptomChecker" },
  { label: "About", route: "About" },
  { label: "Contact", route: "Contact" },
];

export default function Navbar({ navigation, currentRoute }) {
  const { token, setToken, userData } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const close = () => setMenuOpen(false);

  const go = (route) => {
    close();
    navigation.navigate(route);
  };

  const logout = async () => {
    close();
    await AsyncStorage.removeItem("token");
    setToken("");
    navigation.replace("Home");
  };

  const avatarUri =
    userData?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || "User")}&size=80&background=EEF0FF&color=5f6FFF&bold=true`;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.75}
        >
          <NavLogo />
        </TouchableOpacity>

        {/* Right side icons */}
        <View style={styles.rightIcons}>
          {/* AI Symptom Checker */}
          <TouchableOpacity
            onPress={() => navigation.navigate("SymptomChecker")}
            style={styles.iconBtn}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Text style={styles.iconText}>🤖</Text>
          </TouchableOpacity>

          {/* Search */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Search")}
            style={styles.iconBtn}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>

          {/* Favourites */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Favourites")}
            style={styles.iconBtn}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Text style={styles.iconText}>🤍</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMenuOpen(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {token && userData ? (
              <View style={styles.avatarWrap}>
                <Image source={{ uri: avatarUri }} style={styles.navAvatar} />
                <View style={styles.onlineDot} />
              </View>
            ) : (
              <View style={styles.hamburger}>
                <View style={styles.hBar} />
                <View style={[styles.hBar, styles.hBarMid]} />
                <View style={styles.hBar} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Drawer Modal */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close} />

        <View style={[styles.drawer, { paddingTop: insets.top || 44 }]}>
          {/* ── Drawer Header  */}
          <View style={styles.drawerHeader}>
            <NavLogo size={20} />
            <TouchableOpacity
              onPress={close}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.closeIcon}>
                <View
                  style={[
                    styles.closeLine,
                    { transform: [{ rotate: "45deg" }] },
                  ]}
                />
                <View
                  style={[
                    styles.closeLine,
                    styles.closeLineAbs,
                    { transform: [{ rotate: "-45deg" }] },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.drawerBody}
          >
            {/* ── User profile card ──────────────────────────────────────────── */}
            {token && userData && (
              <TouchableOpacity
                style={styles.profileCard}
                onPress={() => go("MyProfile")}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.profileAvatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {userData.name}
                  </Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {userData.email}
                  </Text>
                </View>
                <View style={styles.profileArrow}>
                  <Text style={styles.profileArrowText}>›</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* ── Navigation section ─*/}
            <Text style={styles.sectionLabel}>NAVIGATION</Text>

            <View style={styles.linkList}>
              {NAV_LINKS.map(({ label, route }) => {
                const active = currentRoute === route;
                return (
                  <TouchableOpacity
                    key={route}
                    style={[styles.linkItem, active && styles.linkItemActive]}
                    onPress={() => go(route)}
                    activeOpacity={0.7}
                  >
                    {active && <View style={styles.activeAccent} />}
                    <Text
                      style={[
                        styles.linkLabel,
                        active && styles.linkLabelActive,
                      ]}
                    >
                      {label}
                    </Text>
                    <Text
                      style={[styles.linkArrow, active && { color: PRIMARY }]}
                    >
                      ›
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.separator} />

            {/* ── Account section ─*/}
            {!token ? (
              <>
                <Text style={styles.sectionLabel}>ACCOUNT</Text>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => go("Login")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signupBtn}
                  onPress={() => {
                    close();
                    navigation.push("Login", { mode: "SignUp" });
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.signupBtnText}>Create Account</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionLabel}>ACCOUNT</Text>
                <View style={styles.linkList}>
                  <TouchableOpacity
                    style={styles.linkItem}
                    onPress={() => go("MyProfile")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.linkLabel}>My Profile</Text>
                    <Text style={styles.linkArrow}>›</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.linkItem}
                    onPress={() => go("MyAppointments")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.linkLabel}>My Appointments</Text>
                    <Text style={styles.linkArrow}>›</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.separator} />

                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={logout}
                  activeOpacity={0.8}
                >
                  <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── Footer note ─── */}
            <Text style={styles.footerNote}>CareConnect © 2025</Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  /* ── Navbar ─────── */
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  logoText: {
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  /* avatar in navbar */
  avatarWrap: { position: "relative" },
  navAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  /* hamburger */
  hamburger: { gap: 5 },
  hBar: { width: 22, height: 2, backgroundColor: "#374151", borderRadius: 2 },
  hBarMid: { width: 15 },

  /* right icon group */
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: { padding: 6 },
  iconText: { fontSize: 20 },

  /* ── Drawer ─────── */
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(17,24,39,0.35)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_W * 0.88,
    backgroundColor: "#fff",
    elevation: 24,
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.18)",
  },

  /* Header */
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  closeBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    width: 18,
    height: 18,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  closeLine: {
    position: "absolute",
    width: 18,
    height: 2,
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
  },
  closeLineAbs: {},

  /* Body */
  drawerBody: { paddingHorizontal: 20, paddingBottom: 40 },

  /* Profile card */
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
    backgroundColor: "#F8F9FF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8ECFF",
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  profileEmail: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  profileArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileArrowText: {
    fontSize: 18,
    color: PRIMARY,
    fontWeight: "600",
    lineHeight: 22,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 4,
  },

  /* Link list */
  linkList: { marginBottom: 4 },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
    position: "relative",
    overflow: "hidden",
  },
  linkItemActive: { backgroundColor: "#F0F4FF" },
  activeAccent: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderRadius: 2,
    backgroundColor: PRIMARY,
  },
  linkLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 8,
  },
  linkLabelActive: { color: PRIMARY, fontWeight: "700" },
  linkArrow: { fontSize: 20, color: "#D1D5DB", lineHeight: 22 },

  /* Separator */
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },

  /* Login / Signup buttons */
  loginBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  loginBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  signupBtn: {
    backgroundColor: "#F0F4FF",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  signupBtnText: { color: PRIMARY, fontSize: 15, fontWeight: "600" },

  /* Sign out */
  logoutBtn: {
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    backgroundColor: "#FFF5F5",
    alignItems: "center",
  },
  logoutText: { color: "#EF4444", fontSize: 15, fontWeight: "600" },

  /* Footer */
  footerNote: {
    textAlign: "center",
    fontSize: 11,
    color: "#D1D5DB",
    marginTop: 32,
  },
});
