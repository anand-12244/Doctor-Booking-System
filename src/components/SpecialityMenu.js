import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import GeneralPhysician from "../assets/General_physician.svg";
import Gynecologist from "../assets/Gynecologist.svg";
import Dermatologist from "../assets/Dermatologist.svg";
import Pediatricians from "../assets/Pediatricians.svg";
import Neurologist from "../assets/Neurologist.svg";
import Gastroenterologist from "../assets/Gastroenterologist.svg";

const ICON_SIZE = 60;

const specialityData = [
  { speciality: "General physician", Icon: GeneralPhysician },
  { speciality: "Gynecologist", Icon: Gynecologist },
  { speciality: "Dermatologist", Icon: Dermatologist },
  { speciality: "Pediatricians", Icon: Pediatricians },
  { speciality: "Neurologist", Icon: Neurologist },
  { speciality: "Gastroenterologist", Icon: Gastroenterologist },
];

const SpecialityMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find by Speciality</Text>
      <Text style={styles.desc}>
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {specialityData.map(({ speciality, Icon }, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => navigation.navigate("Doctors", { speciality })}
            activeOpacity={0.75}
          >
            {/* Circular icon container */}
            <View style={styles.iconCircle}>
              <Icon width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <Text style={styles.itemText}>{speciality}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    textAlign: "center",
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  scrollRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 20,
  },
  item: {
    alignItems: "center",
    width: 90,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  itemText: {
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
  },
});

export default SpecialityMenu;
