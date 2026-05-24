import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import { FavouritesContext } from '../context/FavouritesContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SPECIALITIES = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
];

const DoctorsScreen = ({ route, navigation }) => {
  const { speciality } = route.params || {};
  const { doctors, getDoctors } = useContext(AppContext);
  const { isFavourite, toggleFavourite } = useContext(FavouritesContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(speciality || null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getDoctors();
    } finally {
      setRefreshing(false);
    }
  }, [getDoctors]);

  useEffect(() => {
    if (selectedSpec) {
      setFilterDoc(doctors.filter(doc => doc.speciality === selectedSpec));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, selectedSpec]);

  const selectFilter = (spec) => {
    setSelectedSpec(spec === selectedSpec ? null : spec);
  };

  const DoctorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Appointment', { docId: item._id })}
      activeOpacity={0.85}
    >
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
      </View>
      {/* Heart button */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => toggleFavourite(item._id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.heartIcon}>{isFavourite(item._id) ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
      <View style={styles.cardInfo}>
        <View style={styles.availRow}>
          <View style={[styles.availDot, { backgroundColor: item.available ? '#10B981' : '#9CA3AF' }]} />
          <Text style={[styles.availText, { color: item.available ? '#10B981' : '#9CA3AF' }]}>
            {item.available ? 'Available' : 'Not Available'}
          </Text>
        </View>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardSpec} numberOfLines={1}>{item.speciality}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Navbar navigation={navigation} currentRoute="Doctors" />

      {/* Using ScrollView so Footer scrolls naturally with content */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5f6FFF']}
            tintColor="#5f6FFF"
          />
        }
      >
        <Text style={styles.pageTitle}>Browse through the doctors specialist.</Text>

        {/* ── Speciality Filter Chips ───────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={[styles.chip, !selectedSpec && styles.chipActive]}
            onPress={() => setSelectedSpec(null)}
          >
            <Text style={[styles.chipText, !selectedSpec && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {SPECIALITIES.map((spec) => (
            <TouchableOpacity
              key={spec}
              style={[styles.chip, selectedSpec === spec && styles.chipActive]}
              onPress={() => selectFilter(spec)}
            >
              <Text style={[styles.chipText, selectedSpec === spec && styles.chipTextActive]}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Doctor Grid ───────────────────────────────────────────────── */}
        {doctors.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#5f6FFF" />
          </View>
        ) : filterDoc.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No doctors found for this speciality.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filterDoc.map((item) => (
              <DoctorCard key={item._id} item={item} />
            ))}
          </View>
        )}

        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 0 },

  pageTitle: {
    fontSize: 15,
    color: '#4B5563',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },

  // Filter chips
  filterScroll: { maxHeight: 44, marginBottom: 16 },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#EEF0FF',
    borderColor: '#5f6FFF',
  },
  chipText: { fontSize: 13, color: '#4B5563' },
  chipTextActive: { color: '#5f6FFF', fontWeight: '600' },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },

  // Doctor Card
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    position: 'relative',
  },
  heartBtn: {
    position: 'absolute',
    top: 8, right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    width: 30, height: 30,
    alignItems: 'center', justifyContent: 'center',
  },
  heartIcon: { fontSize: 16 },
  cardImageWrap: {
    backgroundColor: '#EFF6FF',
    height: 170,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cardImage: { width: '90%', height: 165, alignSelf: 'center' },
  cardInfo: { padding: 10 },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  availDot: { width: 7, height: 7, borderRadius: 4 },
  availText: { fontSize: 11, fontWeight: '500' },
  cardName: { fontSize: 15, fontWeight: '500', color: '#111827', marginBottom: 2 },
  cardSpec: { fontSize: 12, color: '#6B7280' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#9CA3AF', fontSize: 15 },
});

export default DoctorsScreen;
