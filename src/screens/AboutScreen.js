import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Navbar navigation={navigation} currentRoute="About" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* Heading */}
          <Text style={styles.heading}>
            ABOUT <Text style={styles.headingBold}>US</Text>
          </Text>

          {/* About Image */}
          <Image
            source={require('../assets/about_image.png')}
            style={styles.aboutImage}
            resizeMode="cover"
          />

          {/* About Text */}
          <View style={styles.aboutText}>
            <Text style={styles.bodyText}>
              Welcome to{' '}
              <Text style={styles.boldText}>CareConnect</Text>, your trusted partner in
              managing your healthcare needs conveniently and efficiently. We understand
              the challenges individuals face when it comes to scheduling doctor
              appointments and managing their health records.
            </Text>

            <Text style={styles.bodyText}>
              CareConnect is committed to excellence in healthcare technology. We
              continuously strive to enhance our platform by integrating the latest
              advancements to improve user experience and deliver superior service.
            </Text>

            <Text style={styles.visionTitle}>Our Vision</Text>
            <Text style={styles.bodyText}>
              To create a seamless healthcare experience for every user by bridging
              the gap between patients and healthcare providers, making quality care
              more accessible.
            </Text>
          </View>

          {/* Why Choose Us */}
          <Text style={styles.subHeading}>
            WHY <Text style={styles.headingBold}>CHOOSE US</Text>
          </Text>

          <View style={styles.cardsContainer}>
            {[
              {
                title: 'Efficiency',
                desc: 'Streamlined appointment scheduling that fits perfectly into your busy lifestyle.',
              },
              {
                title: 'Convenience',
                desc: 'Easy access to a network of trusted healthcare professionals in your local area.',
              },
              {
                title: 'Personalization',
                desc: 'Tailored recommendations and reminders to help you stay on top of your health goals.',
              },
            ].map((card) => (
              <View key={card.title} style={styles.card}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDesc}>{card.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 20, paddingTop: 32 },
  heading: {
    fontSize: 26,
    color: '#9CA3AF',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 28,
  },
  headingBold: {
    color: '#1F2937',
    fontWeight: '700',
  },
  aboutImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 24,
  },
  aboutText: {
    gap: 16,
    marginBottom: 36,
  },
  bodyText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 26,
  },
  boldText: {
    fontWeight: '600',
    color: '#1F2937',
  },
  visionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  subHeading: {
    fontSize: 20,
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 14,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 24,
    gap: 10,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.04)',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
});

export default AboutScreen;
