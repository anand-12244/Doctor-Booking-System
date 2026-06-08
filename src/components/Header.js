import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { assets } from "../assets/assets";

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Left Side Content */}
      <View style={styles.leftSide}>
        <Text style={styles.title}>
          Book Appointment{"\n"}With Trusted Doctors
        </Text>
        <View style={styles.descContainer}>
          <Image
            source={assets.group_profiles}
            style={styles.groupProfiles}
            resizeMode="contain"
          />
          <Text style={styles.descText}>
            Simply browse through our extensive list of trusted doctors,{"\n"}
            schedule your appointment hassle-free.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Doctors")}
        >
          <Text style={styles.buttonText}>Book appointment</Text>
          <Image
            source={assets.arrow_icon}
            style={styles.arrowIcon}
            tintColor="#4B5563"
          />
        </TouchableOpacity>
      </View>

      {/* Right Side Content (Image) */}
      <View style={styles.rightSide}>
        <Image
          source={assets.header_img}
          style={styles.headerImg}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5f6FFF",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingTop: 30,
    flexDirection: "column",
    overflow: "hidden",
  },
  leftSide: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 36,
  },
  descContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  groupProfiles: {
    width: 100,
    height: 40,
  },
  descText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "300",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
    gap: 8,
  },
  buttonText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
  rightSide: {
    alignItems: "center",
    marginTop: 10,
  },
  headerImg: {
    width: "100%",
    height: 250,
  },
});

export default Header;
