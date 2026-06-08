import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const AIBanner = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Glow highlight */}
      <View style={styles.glow} />

      {/* Content wrapper */}
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🤖 AI Powered</Text>
        </View>

        <Text style={styles.title}>Not Feeling Well?</Text>
        <Text style={styles.subtitle}>
          Describe your symptoms to our medical AI and get instant suggestions
          for the right doctor.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SymptomChecker")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Try AI Symptom Checker ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1B4B", // Rich dark indigo/navy
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#312E81",
    elevation: 4,
    boxShadow: "0 4px 20px rgba(95, 111, 255, 0.15)",
  },
  glow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(95, 111, 255, 0.3)", // Glow matching primary blue
    filter: "blur(40px)",
  },
  content: {
    alignItems: "flex-start",
    zIndex: 1,
  },
  badge: {
    backgroundColor: "rgba(95, 111, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(95, 111, 255, 0.4)",
    marginBottom: 12,
  },
  badgeText: {
    color: "#818CF8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#C7D2FE",
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: "400",
  },
  button: {
    backgroundColor: "#5f6FFF", // Primary brand color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5f6FFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AIBanner;
