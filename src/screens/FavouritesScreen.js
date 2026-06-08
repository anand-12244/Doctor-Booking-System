import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../context/AppContext";
import { FavouritesContext } from "../context/FavouritesContext";
import { getDoctorImage } from "../assets/assets";
import Navbar from "../components/Navbar";

const PRIMARY = "#5f6FFF";

const FavouritesScreen = ({ navigation }) => {
  const { doctors } = useContext(AppContext);
  const { favourites, toggleFavourite } = useContext(FavouritesContext);

  const favDoctors = doctors.filter((d) => favourites.includes(d._id));

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Navbar navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <Text style={s.pageTitle}>My Favourites</Text>
        <Text style={s.pageSub}>Doctors you've saved for quick access</Text>

        {favDoctors.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🤍</Text>
            <Text style={s.emptyTitle}>No favourites yet</Text>
            <Text style={s.emptySub}>
              Tap the heart icon on any doctor to save them here.
            </Text>
            <TouchableOpacity
              style={s.browseBtn}
              onPress={() => navigation.navigate("Doctors", {})}
            >
              <Text style={s.browseBtnText}>Browse Doctors</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favDoctors.map((doc) => (
            <TouchableOpacity
              key={doc._id}
              style={s.card}
              onPress={() =>
                navigation.navigate("Appointment", { docId: doc._id })
              }
              activeOpacity={0.85}
            >
              {/* Image */}
              <View style={s.imgWrap}>
                <Image
                  source={getDoctorImage(doc.imageKey || doc._id)}
                  style={s.img}
                  resizeMode="contain"
                />
              </View>

              {/* Info */}
              <View style={s.info}>
                <Text style={s.name}>{doc.name}</Text>
                <Text style={s.spec}>{doc.speciality}</Text>
                <View style={s.metaRow}>
                  <View
                    style={[
                      s.dot,
                      {
                        backgroundColor: doc.available ? "#10B981" : "#9CA3AF",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      s.availText,
                      { color: doc.available ? "#10B981" : "#9CA3AF" },
                    ]}
                  >
                    {doc.available ? "Available" : "Unavailable"}
                  </Text>
                </View>
                <Text style={s.degree}>
                  {doc.degree} • {doc.experience}
                </Text>
              </View>

              {/* Remove favourite */}
              <TouchableOpacity
                style={s.heartBtn}
                onPress={() => toggleFavourite(doc._id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={s.heartIcon}>❤️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { padding: 16, paddingBottom: 40 },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  pageSub: { fontSize: 14, color: "#9CA3AF", marginBottom: 20 },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 30,
  },
  browseBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 14,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
  },
  imgWrap: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  img: { width: 72, height: 72 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 2 },
  spec: { fontSize: 13, color: "#6B7280", marginBottom: 5 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  availText: { fontSize: 12, fontWeight: "500" },
  degree: { fontSize: 11, color: "#9CA3AF" },
  heartBtn: { padding: 4 },
  heartIcon: { fontSize: 24 },
});

export default FavouritesScreen;
