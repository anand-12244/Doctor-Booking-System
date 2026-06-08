import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AppContext } from "../context/AppContext";
import { FavouritesContext } from "../context/FavouritesContext";
import { getDoctorImage } from "../assets/assets";

const TopDoctors = ({ navigation }) => {
  const { doctors, token } = useContext(AppContext);
  const { isFavourite, toggleFavourite } = useContext(FavouritesContext);

  const handleFavouritePress = (docId) => {
    if (!token) {
      Alert.alert(
        "Login Required",
        "Please login to add doctors to your favourites",
      );
      return;
    }
    toggleFavourite(docId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Doctors to Book</Text>
      <Text style={styles.desc}>
        Simply browse through our extensive list of trusted doctors.
      </Text>

      <View style={styles.gridContainer}>
        {doctors.slice(0, 10).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("Appointment", { docId: item._id })
            }
          >
            {/* Heart Button */}
            <TouchableOpacity
              style={styles.heartBtn}
              onPress={() => handleFavouritePress(item._id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.heartIcon}>
                {isFavourite(item._id) ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              <Image
                source={getDoctorImage(item.imageKey || item._id)}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: item.available ? "#10B981" : "#6B7280" },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: item.available ? "#10B981" : "#6B7280" },
                  ]}
                >
                  {item.available ? "Available" : "Not Available"}
                </Text>
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.speciality}>{item.speciality}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => navigation.navigate("Doctors")}
      >
        <Text style={styles.moreButtonText}>more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 5,
  },
  desc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.06)",
  },
  imageContainer: {
    backgroundColor: "#EFF6FF",
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  speciality: {
    fontSize: 12,
    color: "#4B5563",
  },
  moreButton: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  moreButtonText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
  },
  heartIcon: {
    fontSize: 24,
  },
});

export default TopDoctors;
