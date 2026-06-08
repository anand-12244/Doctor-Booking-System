import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import { getDoctorImage } from '../assets/assets';
import Navbar from '../components/Navbar';
import groqService from '../services/groqService';
import { matchDoctorsWithSpecialities } from '../utils/doctorMatcher';

const PRIMARY = '#5f6FFF';
const SUCCESS = '#10B981';
const BACKGROUND_LIGHT = '#F8FAFC';

const QUICK_SYMPTOMS = [
  { label: 'Fever & Cough 🌡️', text: 'I have a high fever, dry cough, and mild throat irritation.' },
  { label: 'Migraine/Headache 🧠', text: 'I am experiencing severe throbbing pain on one side of my head, sensitivity to light, and slight dizziness.' },
  { label: 'Skin Redness/Rash 🧴', text: 'There is an itchy, red rash on my arm with minor swelling and dry skin patches.' },
  { label: 'Stomach Pain/Reflux 🤢', text: 'I have severe acid reflux, stomach bloating, and indigestion after eating.' },
  { label: 'Chest Discomfort 💔', text: 'I feel tightness and minor pain in my chest, especially when breathing deeply.' }
];

const SymptomCheckerScreen = ({ navigation }) => {
  const { doctors } = useContext(AppContext);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);

  // Cycle loading messages for a premium feel
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const getLoadingMessage = () => {
    switch (loadingStep) {
      case 0:
        return 'Connecting to Medical AI engine...';
      case 1:
        return 'Analyzing symptom patterns...';
      case 2:
        return 'Consulting medical speciality index...';
      case 3:
        return 'Matching with available doctors...';
      default:
        return 'Analyzing symptoms...';
    }
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please enter your symptoms');
      return;
    }

    setLoading(true);
    setResult(null);
    setRecommendedDoctors([]);
    
    try {
      const analysis = await groqService.analyzeSymptoms(symptoms);
      setResult(analysis);

      // Match doctors with recommended specialities
      if (analysis.specialities) {
        const matched = matchDoctorsWithSpecialities(doctors, analysis.specialities);
        setRecommendedDoctors(matched);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to analyze symptoms');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyDetails = (urgency) => {
    const val = (urgency || '').toLowerCase();
    if (val.includes('emergency')) {
      return { color: '#EF4444', label: 'EMERGENCY', bg: '#FEE2E2', border: '#FCA5A5' };
    }
    if (val.includes('urgent')) {
      return { color: '#F97316', label: 'URGENT CARE', bg: '#FFEDD5', border: '#FED7AA' };
    }
    return { color: '#3B82F6', label: 'ROUTINE CONSULT', bg: '#DBEAFE', border: '#BFDBFE' };
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Navbar navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <View style={s.container}>
          {/* Header */}
          <View style={s.headerCard}>
            <View style={s.headerBadge}>
              <Text style={s.headerBadgeText}>🤖 SMART DIAGNOSTICS</Text>
            </View>
            <Text style={s.title}>AI Symptom Checker</Text>
            <Text style={s.subtitle}>
              Describe how you feel in detail. Our advanced AI will analyze your symptoms and suggest the ideal specialist.
            </Text>
          </View>

          {/* Input Section */}
          <View style={s.card}>
            <Text style={s.label}>How are you feeling today?</Text>
            
            {/* Quick Pills */}
            <Text style={s.subLabel}>Tap a common symptom to autofill:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={s.pillsRow}
            >
              {QUICK_SYMPTOMS.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={s.pill}
                  onPress={() => setSymptoms(item.text)}
                  activeOpacity={0.7}
                >
                  <Text style={s.pillText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={s.textInput}
              placeholder="Describe your symptoms (e.g., fever for 2 days, dry cough, fatigue, headache...)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              value={symptoms}
              onChangeText={setSymptoms}
              editable={!loading}
            />

            <TouchableOpacity
              style={[s.analyzeBtn, loading && s.analyzeBtnDisabled]}
              onPress={handleAnalyzeSymptoms}
              disabled={loading}
            >
              {loading ? (
                <View style={s.loadingContainer}>
                  <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                  <Text style={s.analyzeBtnText}>{getLoadingMessage()}</Text>
                </View>
              ) : (
                <Text style={s.analyzeBtnText}>Analyze Symptoms with AI ➔</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Loading Animation Block */}
          {loading && (
            <View style={s.loadingCard}>
              <ActivityIndicator size="large" color={PRIMARY} />
              <Text style={s.loadingTitle}>Processing AI Analysis</Text>
              <Text style={s.loadingText}>{getLoadingMessage()}</Text>
            </View>
          )}

          {/* Result Section */}
          {result && !loading && (
            <View style={s.resultSection}>
              {/* Assessment Card */}
              {(() => {
                const urgency = getUrgencyDetails(result.urgency);
                return (
                  <View style={[s.assessmentCard, { borderLeftColor: urgency.color }]}>
                    <View style={s.assessmentHeader}>
                      <Text style={s.assessmentTitle}>Initial AI Assessment</Text>
                      <View style={[s.urgencyBadge, { backgroundColor: urgency.bg, borderColor: urgency.border }]}>
                        <Text style={[s.urgencyText, { color: urgency.color }]}>{urgency.label}</Text>
                      </View>
                    </View>

                    <Text style={s.assessmentText}>
                      {result.initial_assessment}
                    </Text>

                    {result.recommended_steps && result.recommended_steps.length > 0 && (
                      <View style={s.stepsSection}>
                        <Text style={s.stepsTitle}>Recommended Actions:</Text>
                        {result.recommended_steps.map((step, idx) => (
                          <Text key={idx} style={s.stepItem}>• {step}</Text>
                        ))}
                      </View>
                    )}

                    <View style={s.confidenceRow}>
                      <Text style={s.confidenceLabel}>AI Confidence Score:</Text>
                      <View style={s.confidenceBarContainer}>
                        <View 
                          style={[
                            s.confidenceBar, 
                            { 
                              width: result.confidence === 'high' ? '100%' : result.confidence === 'medium' ? '70%' : '35%',
                              backgroundColor: result.confidence === 'high' ? SUCCESS : result.confidence === 'medium' ? '#F59E0B' : '#EF4444'
                            }
                          ]} 
                        />
                      </View>
                      <Text
                        style={[
                          s.confidenceValue,
                          {
                            color:
                              result.confidence === 'high'
                                ? SUCCESS
                                : result.confidence === 'medium'
                                ? '#F59E0B'
                                : '#EF4444',
                          },
                        ]}
                      >
                        {result.confidence?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                );
              })()}

              {/* Recommended Specialities */}
              {result.specialities && result.specialities.length > 0 && (
                <View style={s.section}>
                  <Text style={s.sectionTitle}>Recommended Specialities</Text>
                  <View style={s.specialitiesList}>
                    {result.specialities.map((spec, idx) => (
                      <View key={idx} style={s.specialityTag}>
                        <Text style={s.specialityTagText}>🔍 {spec}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Recommended Doctors */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>
                  Matched Specialists Available ({recommendedDoctors.length})
                </Text>

                {recommendedDoctors.map((doctor) => (
                  <TouchableOpacity
                    key={doctor._id}
                    style={s.doctorCard}
                    onPress={() =>
                      navigation.navigate('Appointment', { docId: doctor._id })
                    }
                    activeOpacity={0.85}
                  >
                    <Image
                      source={getDoctorImage(doctor.imageKey || doctor._id)}
                      style={s.doctorImage}
                      resizeMode="cover"
                    />

                    <View style={s.doctorInfo}>
                      <View style={s.doctorNameRow}>
                        <Text style={s.doctorName}>{doctor.name}</Text>
                        {doctor.rating && (
                          <View style={s.ratingBox}>
                            <Text style={s.rating}>★ {doctor.rating.toFixed(1)}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.doctorSpec}>{doctor.speciality}</Text>

                      <Text style={s.doctorExperience}>
                        🎓 {doctor.degree} • {doctor.experience}
                      </Text>

                      <View style={s.doctorMeta}>
                        <View
                          style={[
                            s.availDot,
                            {
                              backgroundColor: doctor.available
                                ? SUCCESS
                                : '#9CA3AF',
                            },
                          ]}
                        />
                        <Text
                          style={[
                            s.availText,
                            {
                              color: doctor.available ? SUCCESS : '#9CA3AF',
                            },
                          ]}
                        >
                          {doctor.available ? 'Available Today' : 'Not Available'}
                        </Text>
                      </View>
                    </View>

                    <View style={s.bookBtn}>
                      <Text style={s.bookBtnText}>Book</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {recommendedDoctors.length === 0 && (
                  <View style={s.noDoctorsBox}>
                    <Text style={s.noDoctorsEmoji}>🔍</Text>
                    <Text style={s.noDoctorsTitle}>No Exact Speciality Matches</Text>
                    <Text style={s.noDoctorsSubtitle}>
                      Try broadening your symptom description or browse our complete medical directory.
                    </Text>
                    <TouchableOpacity
                      style={s.browseBtn}
                      onPress={() => navigation.navigate('Doctors')}
                    >
                      <Text style={s.browseBtnText}>Browse All Doctors</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Empty State */}
          {!result && !loading && (
            <View style={s.emptyState}>
              <View style={s.emptyStateIconContainer}>
                <Text style={s.emptyStateEmoji}>🩺</Text>
              </View>
              <Text style={s.emptyStateTitle}>Your AI Assistant is Ready</Text>
              <Text style={s.emptyStateText}>
                Describe your symptoms above or tap a quick-fill tag to begin your personalized health guidance.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  scroll: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerBadge: {
    backgroundColor: 'rgba(95, 111, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  headerBadgeText: {
    color: PRIMARY,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  pillsRow: {
    paddingBottom: 12,
    gap: 8,
  },
  pill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 110,
    backgroundColor: '#F8FAFC',
  },
  analyzeBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  analyzeBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  resultSection: {
    gap: 16,
  },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  assessmentText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 16,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 8,
  },
  confidenceBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  specialitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialityTag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  specialityTagText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#EFF6FF',
  },
  doctorInfo: {
    flex: 1,
    gap: 4,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorSpec: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: '600',
  },
  doctorExperience: {
    fontSize: 11,
    color: '#64748B',
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  availText: {
    fontSize: 11,
    fontWeight: '500',
  },
  ratingBox: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  bookBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  noDoctorsBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  noDoctorsEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  noDoctorsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  noDoctorsSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  browseBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyStateIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateEmoji: {
    fontSize: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  stepsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  stepItem: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default SymptomCheckerScreen;
