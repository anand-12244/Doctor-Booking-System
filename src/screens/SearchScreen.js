import React, { useContext, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, Image,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import { FavouritesContext } from '../context/FavouritesContext';
import { getDoctorImage } from '../assets/assets';

const PRIMARY = '#5f6FFF';

const SearchScreen = ({ navigation }) => {
  const { doctors } = useContext(AppContext);
  const { isFavourite, toggleFavourite } = useContext(FavouritesContext);
  const [query, setQuery] = useState('');

  const filtered = query.trim().length === 0
    ? []
    : doctors.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.speciality.toLowerCase().includes(query.toLowerCase())
      );

  const SPECIALITIES = [
    'General physician', 'Gynecologist', 'Dermatologist',
    'Pediatricians', 'Neurologist', 'Gastroenterologist',
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <View style={s.inputWrap}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.input}
            placeholder="Search doctors, specialities..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={s.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

        {query.trim().length === 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Browse by Speciality</Text>
            <View style={s.chipGrid}>
              {SPECIALITIES.map(spec => (
                <TouchableOpacity
                  key={spec}
                  style={s.specChip}
                  onPress={() => navigation.navigate('Doctors', { speciality: spec })}
                  activeOpacity={0.8}
                >
                  <Text style={s.specChipText}>{spec}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        {query.trim().length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
            </Text>

            {filtered.length === 0 ? (
              <View style={s.emptyBox}>
                <Text style={s.emptyEmoji}>🩺</Text>
                <Text style={s.emptyTitle}>No doctors found</Text>
                <Text style={s.emptySubtitle}>Try a different name or speciality</Text>
              </View>
            ) : (
              filtered.map(doc => (
                <TouchableOpacity
                  key={doc._id}
                  style={s.resultCard}
                  onPress={() => navigation.navigate('Appointment', { docId: doc._id })}
                  activeOpacity={0.85}
                >
                  <View style={s.resultImgWrap}>
                    <Image
                      source={getDoctorImage(doc.imageKey || doc._id)}
                      style={s.resultImg}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={s.resultInfo}>
                    <Text style={s.resultName}>{doc.name}</Text>
                    <Text style={s.resultSpec}>{doc.speciality}</Text>
                    <View style={s.resultMeta}>
                      <View style={[s.dot, { backgroundColor: doc.available ? '#10B981' : '#9CA3AF' }]} />
                      <Text style={[s.availText, { color: doc.available ? '#10B981' : '#9CA3AF' }]}>
                        {doc.available ? 'Available' : 'Unavailable'}
                      </Text>
                      <Text style={s.fee}>  •  ${doc.fees}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={s.heartBtn}
                    onPress={() => toggleFavourite(doc._id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={s.heartIcon}>{isFavourite(doc._id) ? '❤️' : '🤍'}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: PRIMARY, fontWeight: '500' },

  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
  },
  searchIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15, color: '#111827', padding: 0 },
  clearBtn: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },

  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14,
  },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    backgroundColor: '#F0F4FF', borderRadius: 20,
    borderWidth: 1, borderColor: '#E0E7FF',
  },
  specChipText: { fontSize: 13, color: PRIMARY, fontWeight: '500' },

  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: '#374151', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF' },

  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#E5E7EB',
    padding: 12, marginBottom: 12,
    boxShadow: '0px 1px 4px rgba(0,0,0,0.04)',
  },
  resultImgWrap: {
    width: 68, height: 68, borderRadius: 12,
    backgroundColor: '#EFF6FF', overflow: 'hidden',
    alignItems: 'center', justifyContent: 'flex-end',
  },
  resultImg: { width: 64, height: 64 },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  resultSpec: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  resultMeta: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 4 },
  availText: { fontSize: 12, fontWeight: '500' },
  fee: { fontSize: 12, color: '#9CA3AF' },
  heartBtn: { padding: 4 },
  heartIcon: { fontSize: 22 },
});

export default SearchScreen;
