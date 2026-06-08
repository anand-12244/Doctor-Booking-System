import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";

const GENDER_OPTIONS = ["Not Selected", "Male", "Female", "Other"];

const MyProfileScreen = ({ navigation }) => {
  const { userData, setUserData, backendUrl, token, setToken } =
    useContext(AppContext);

  const [displayData, setDisplayData] = useState(userData);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && !isEdit) {
      setDisplayData(userData);
    }
  }, [userData, isEdit]);

  // Sync editData whenever we enter edit mode
  const startEdit = () => {
    const source = displayData || userData;
    setEditData({
      name: source?.name || "",
      phone: source?.phone || "",
      gender: source?.gender || "Not Selected",
      dob: source?.dob || "",
      address: {
        line1: source?.address?.line1 || "",
        line2: source?.address?.line2 || "",
      },
    });
    setIsEdit(true);
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setEditData(null);
    setLocalImage(null);
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken("");
    navigation.replace("Login");
  };

  // ─── Pick image from gallery ────────────────────────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert(
        "Permission needed",
        "Please allow gallery access to change your photo.",
      );
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]) {
      setLocalImage(result.assets[0].uri);
    }
  };

  // ─── Save profile ───────────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!editData.name.trim()) {
      return Alert.alert("Missing fields", "Please enter your name.");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name.trim());
      // Using json-server: PUT /users/:id
      const updatedProfileData = {
        name: editData.name.trim(),
        phone: editData.phone || "",
        gender: editData.gender || "Not Selected",
        dob: editData.dob || "",
        address: editData.address || {},
        password: userData.password || "", 
        email: userData.email || "",
        ...(localImage ? { image: localImage } : {}),
      };

      const { data } = await axios.put(
        backendUrl + `/users/${token}`,
        updatedProfileData,
      );

      if (data) {
        const updatedUser = {
          ...(displayData || userData),
          name: editData.name.trim(),
          phone: editData.phone || "",
          gender: editData.gender || "Not Selected",
          dob: editData.dob || "",
          address: editData.address || {},
          ...(localImage ? { image: localImage } : {}),
        };
      
        setDisplayData(updatedUser);
        //  Update context
        setUserData(updatedUser);
        // Persist to AsyncStorage
        await AsyncStorage.setItem(
          "@careconnect_user",
          JSON.stringify(updatedUser),
        );
        setIsEdit(false);
        setEditData(null);
        setLocalImage(null);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", "Update failed. Make sure all fields are filled.");
      }
    } catch (error) {
      console.log("Save profile error:", error);
      Alert.alert(
        "Error",
        error.message || "Could not update profile. Check connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const set = (key, value) =>
    setEditData((prev) => ({ ...prev, [key]: value }));
  const setAddr = (key, value) =>
    setEditData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));

  if (!displayData && !userData) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar navigation={navigation} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#5f6FFF" />
        </View>
      </SafeAreaView>
    );
  }

  const displayImage =
    localImage ||
    (isEdit ? editData?.image : displayData?.image) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayData?.name || "U")}&size=200&background=5f6FFF&color=fff`;

  // Current display source
  const d = isEdit ? editData : displayData || userData;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Navbar navigation={navigation} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.card}>
            {/* ── Profile Photo ──────────────────────────────────────────────── */}
            <TouchableOpacity
              style={styles.photoContainer}
              onPress={isEdit ? pickImage : undefined}
              activeOpacity={isEdit ? 0.7 : 1}
            >
              <Image source={{ uri: displayImage }} style={styles.profilePic} />
              {isEdit && (
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoOverlayText}>📷 Change</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* ── Name ──────────────────────────────────────────────────────── */}
            {isEdit ? (
              <TextInput
                style={styles.nameInput}
                value={editData?.name}
                onChangeText={(v) => set("name", v)}
                placeholder="Full Name"
                textAlign="center"
              />
            ) : (
              <Text style={styles.name}>{d.name}</Text>
            )}
            <Text style={styles.email}>{d.email}</Text>

            <View style={styles.divider} />

            {/* ── Contact Information ────────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Phone</Text>
              {isEdit ? (
                <TextInput
                  style={styles.input}
                  value={editData?.phone}
                  onChangeText={(v) => set("phone", v)}
                  placeholder="+91 00000 00000"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.fieldValue}>{d.phone || "—"}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Gender</Text>
              {isEdit ? (
                <View style={styles.genderRow}>
                  {GENDER_OPTIONS.map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderChip,
                        editData?.gender === g && styles.genderChipActive,
                      ]}
                      onPress={() => set("gender", g)}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          editData?.gender === g && styles.genderChipTextActive,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.fieldValue}>{d.gender || "—"}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              {isEdit ? (
                <TextInput
                  style={styles.input}
                  value={editData?.dob}
                  onChangeText={(v) => set("dob", v)}
                  placeholder="YYYY-MM-DD"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>{d.dob || "—"}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* ── Address ───────────────────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>Address</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Line 1</Text>
              {isEdit ? (
                <TextInput
                  style={styles.input}
                  value={editData?.address?.line1}
                  onChangeText={(v) => setAddr("line1", v)}
                  placeholder="Street address"
                />
              ) : (
                <Text style={styles.fieldValue}>{d.address?.line1 || "—"}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Line 2</Text>
              {isEdit ? (
                <TextInput
                  style={styles.input}
                  value={editData?.address?.line2}
                  onChangeText={(v) => setAddr("line2", v)}
                  placeholder="City, State, Country"
                />
              ) : (
                <Text style={styles.fieldValue}>{d.address?.line2 || "—"}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* ── Action Buttons ─────────────────────────────────────────────── */}
            {isEdit ? (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, loading && styles.btnDisabled]}
                  onPress={saveProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Information</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editBtn} onPress={startEdit}>
                <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
              </TouchableOpacity>
            )}

            {/* ── Logout ─────────────────────────────────────────────────────── */}
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const PRIMARY = "#5f6FFF";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  scroll: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0px 3px 12px rgba(0,0,0,0.06)",
    elevation: 3,
  },
  photoContainer: {
    alignSelf: "center",
    marginBottom: 16,
    position: "relative",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.38)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoOverlayText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 4,
  },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  field: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
    fontWeight: "500",
  },
  fieldValue: { fontSize: 15, color: "#1F2937" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  genderRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  genderChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  genderChipActive: { borderColor: PRIMARY, backgroundColor: "#EEF0FF" },
  genderChipText: { fontSize: 13, color: "#6B7280" },
  genderChipTextActive: { color: PRIMARY, fontWeight: "600" },
  actionRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 15, color: "#374151", fontWeight: "500" },
  saveBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 30,
    backgroundColor: PRIMARY,
    alignItems: "center",
  },
  saveBtnText: { fontSize: 15, color: "#fff", fontWeight: "600" },
  btnDisabled: { opacity: 0.6 },
  editBtn: {
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    alignItems: "center",
    marginBottom: 14,
  },
  editBtnText: { fontSize: 15, color: PRIMARY, fontWeight: "600" },
  logoutBtn: {
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#EF4444",
    alignItems: "center",
  },
  logoutBtnText: { color: "#EF4444", fontSize: 15, fontWeight: "500" },
});

export default MyProfileScreen;
