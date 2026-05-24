import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const PRIMARY = '#5f6FFF';
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// ─── Related Doctors mini-component ──────────────────────────────────────────
const RelatedDoctors = ({ doctors, currentDocId, speciality, navigation }) => {
  const related = doctors.filter(
    d => d.speciality === speciality && d._id !== currentDocId
  ).slice(0, 5);

  if (related.length === 0) return null;

  return (
    <View style={rel.section}>
      <Text style={rel.heading}>Related Doctors</Text>
      <Text style={rel.sub}>Simply browse through our extensive list of trusted doctors.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={rel.row}>
        {related.map(doc => (
          <TouchableOpacity
            key={doc._id}
            style={rel.card}
            onPress={() => navigation.replace('Appointment', { docId: doc._id })}
            activeOpacity={0.85}
          >
            <View style={rel.imgWrap}>
              <Image source={{ uri: doc.image }} style={rel.img} resizeMode="contain" />
            </View>
            <View style={rel.cardBody}>
              <View style={rel.availRow}>
                <View style={[rel.dot, { backgroundColor: doc.available ? '#10B981' : '#9CA3AF' }]} />
                <Text style={[rel.availText, { color: doc.available ? '#10B981' : '#9CA3AF' }]}>
                  {doc.available ? 'Available' : 'Not Available'}
                </Text>
              </View>
              <Text style={rel.name} numberOfLines={1}>{doc.name}</Text>
              <Text style={rel.spec} numberOfLines={1}>{doc.speciality}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────
const AppointmentScreen = ({ route, navigation }) => {
  const { docId } = route.params;
  const { doctors, backendUrl, token, getDoctors, currencySymbol } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);

  // Find doctor
  useEffect(() => {
    if (doctors.length > 0) {
      setDocInfo(doctors.find(d => d._id === docId) || null);
    }
  }, [doctors, docId]);

  // Generate 7-day slots
  useEffect(() => {
    if (!docInfo) return;
    const today = new Date();
    const all = [];
    for (let i = 0; i < 7; i++) {
      const curr = new Date(today);
      curr.setDate(today.getDate() + i);
      const end = new Date(curr);
      end.setHours(21, 0, 0, 0);
      i === 0
        ? curr.setHours(curr.getHours() >= 10 ? curr.getHours() + 1 : 10, 0, 0, 0)
        : curr.setHours(10, 0, 0, 0);

      const slots = [];
      while (curr < end) {
        const time = curr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sd = `${curr.getDate()}_${curr.getMonth() + 1}_${curr.getFullYear()}`;
        if (!docInfo.slots_booked?.[sd]?.includes(time)) {
          slots.push({ datetime: new Date(curr), time });
        }
        curr.setMinutes(curr.getMinutes() + 30);
      }
      all.push(slots);
    }
    setDocSlots(all);
    setSlotIndex(0);
    setSlotTime('');
  }, [docInfo]);

  // Book
  const bookAppointment = async () => {
    if (!token) {
      Alert.alert('Login Required', 'Please login to book an appointment.');
      return navigation.navigate('Login');
    }
    if (!slotTime) return Alert.alert('Select Slot', 'Please select a time slot.');
    const day0 = docSlots[slotIndex];
    if (!day0?.length) return Alert.alert('No Slots', 'No slots available for this day.');

    setLoading(true);
    try {
      const dt = day0[0].datetime;
      const slotDate = `${dt.getDate()}_${dt.getMonth() + 1}_${dt.getFullYear()}`;
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        getDoctors();
        Alert.alert('Appointment Booked!', data.message, [
          { text: 'My Appointments', onPress: () => navigation.navigate('MyAppointments') },
          { text: 'OK' },
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!docInfo) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={s.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  const currSlots = docSlots[slotIndex] || [];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Top bar with back */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

        {/* ── Doctor card (image + info) — web style ────────────────────────── */}
        <View style={s.doctorCard}>
          {/* Blue background image container */}
          <View style={s.imgContainer}>
            <Image
              source={{ uri: docInfo.image }}
              style={s.docImage}
              resizeMode="contain"
            />
          </View>

          {/* Info panel below image (floats slightly over) */}
          <View style={s.infoPanel}>
            {/* Name + verified badge */}
            <View style={s.nameRow}>
              <Text style={s.docName}>{docInfo.name}</Text>
              <View style={s.verifiedBadge}>
                <Text style={s.verifiedTick}>✓</Text>
              </View>
            </View>

            {/* Degree — Speciality + Experience badge */}
            <View style={s.metaRow}>
              <Text style={s.metaText}>{docInfo.degree} — {docInfo.speciality}</Text>
              <View style={s.expBadge}>
                <Text style={s.expText}>{docInfo.experience}</Text>
              </View>
            </View>

            {/* About */}
            <View style={s.aboutSection}>
              <Text style={s.aboutHeading}>About</Text>
              <Text style={s.aboutBody}>{docInfo.about}</Text>
            </View>

            {/* Address */}
            {(docInfo.address?.line1 || docInfo.address?.line2) && (
              <View style={s.addressRow}>
                <Text style={s.addressLabel}>📍 </Text>
                <Text style={s.addressText}>
                  {[docInfo.address?.line1, docInfo.address?.line2].filter(Boolean).join(', ')}
                </Text>
              </View>
            )}

            {/* Fee */}
            <View style={s.feeRow}>
              <Text style={s.feeLabel}>Appointment fee: </Text>
              <Text style={s.feeValue}>{currencySymbol}{docInfo.fees}</Text>
            </View>
          </View>
        </View>

        {/* ── Booking Slots ─────────────────────────────────────────────────── */}
        <View style={s.slotsWrap}>
          <Text style={s.slotsHeading}>Booking Slots</Text>

          {/* Day pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dayRow}>
            {docSlots.map((daySlots, idx) => {
              const dt = daySlots[0]?.datetime;
              const active = slotIndex === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[s.dayPill, active && s.dayPillActive]}
                  onPress={() => { setSlotIndex(idx); setSlotTime(''); }}
                  activeOpacity={0.8}
                >
                  <Text style={[s.dayName, active && s.activeSlotText]}>
                    {dt ? DAYS[dt.getDay()] : '—'}
                  </Text>
                  <Text style={[s.dayNum, active && s.activeSlotText]}>
                    {dt ? dt.getDate() : '—'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Time chips */}
          {currSlots.length === 0 ? (
            <Text style={s.noSlots}>No available slots for this day</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.timeRow}>
              {currSlots.map((slot, idx) => {
                const active = slot.time === slotTime;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[s.timeChip, active && s.timeChipActive]}
                    onPress={() => setSlotTime(slot.time)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.timeText, active && s.activeSlotText]}>
                      {slot.time.toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Book button */}
          <TouchableOpacity
            style={[s.bookBtn, loading && s.bookBtnDim]}
            onPress={bookAppointment}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.bookBtnText}>Book an appointment</Text>
            }
          </TouchableOpacity>
        </View>

        {/* ── Related Doctors ───────────────────────────────────────────────── */}
        <RelatedDoctors
          doctors={doctors}
          currentDocId={docId}
          speciality={docInfo.speciality}
          navigation={navigation}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  topBar: {
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 15, color: PRIMARY, fontWeight: '500' },

  // Doctor card
  doctorCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
  },
  imgContainer: {
    backgroundColor: '#5f6FFF',
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end',       // image sits at the bottom of the blue area
    overflow: 'hidden',
  },
  docImage: {
    width: '85%',
    height: 290,
    alignSelf: 'center',
  },
  infoPanel: {
    padding: 20,
    backgroundColor: '#fff',
  },
  nameRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  docName: { fontSize: 22, fontWeight: '600', color: '#111827', flex: 1 },
  verifiedBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
  },
  verifiedTick: { color: '#fff', fontSize: 13, fontWeight: '800' },

  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 14, flexWrap: 'wrap',
  },
  metaText: { fontSize: 13, color: '#4B5563', flex: 1 },
  expBadge: {
    borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3,
  },
  expText: { fontSize: 12, color: '#6B7280' },

  aboutSection: { marginBottom: 14 },
  aboutHeading: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 },
  aboutBody: { fontSize: 13, color: '#6B7280', lineHeight: 22 },

  addressRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  addressLabel: { fontSize: 13, color: '#6B7280' },
  addressText: { fontSize: 13, color: '#6B7280', flex: 1, lineHeight: 20 },

  feeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  feeLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  feeValue: { fontSize: 15, color: '#111827', fontWeight: '700' },

  // Slots
  slotsWrap: { paddingHorizontal: 16, marginBottom: 8 },
  slotsHeading: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 14 },

  dayRow: { marginBottom: 14 },
  dayPill: {
    alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14,
    borderRadius: 30, borderWidth: 1, borderColor: '#E5E7EB',
    marginRight: 10, minWidth: 60, backgroundColor: '#fff',
  },
  dayPillActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  dayName: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  dayNum: { fontSize: 17, fontWeight: '700', color: '#374151', marginTop: 2 },
  activeSlotText: { color: '#fff' },

  noSlots: { fontSize: 14, color: '#9CA3AF', marginVertical: 10 },

  timeRow: { marginBottom: 24 },
  timeChip: {
    paddingVertical: 9, paddingHorizontal: 18,
    borderRadius: 30, borderWidth: 1, borderColor: '#D1D5DB',
    marginRight: 10, backgroundColor: '#fff',
  },
  timeChipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  timeText: { fontSize: 13, color: '#4B5563' },

  bookBtn: {
    backgroundColor: PRIMARY, paddingVertical: 16,
    borderRadius: 30, alignItems: 'center', marginBottom: 8,
  },
  bookBtnDim: { opacity: 0.6 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '500', letterSpacing: 0.2 },
});

// ─── Related doctors styles ───────────────────────────────────────────────────
const rel = StyleSheet.create({
  section: { paddingHorizontal: 16, marginTop: 8, marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  sub: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
  row: { paddingBottom: 4, gap: 12 },
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
  },
  imgWrap: {
    backgroundColor: '#EFF6FF', height: 140, width: '100%',
    alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden',
  },
  img: { width: '85%', height: 135, alignSelf: 'center' },
  cardBody: { padding: 10 },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  availText: { fontSize: 11, fontWeight: '500' },
  name: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 },
  spec: { fontSize: 11, color: '#6B7280' },
});

export default AppointmentScreen;
