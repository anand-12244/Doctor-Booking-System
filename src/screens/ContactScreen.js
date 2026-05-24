import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Navbar navigation={navigation} currentRoute="Contact" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* Heading */}
          <Text style={styles.heading}>
            CONTACT <Text style={styles.headingBold}>US</Text>
          </Text>

          {/* Contact Image */}
          <Image
            source={require('../assets/contact_image.png')}
            style={styles.contactImage}
            resizeMode="cover"
          />

          {/* Contact Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Our Office</Text>
            <Text style={styles.infoText}>54709 Willms Station{'\n'}Suite 350, Washington, USA</Text>

            <Text style={styles.infoText}>
              Tel: (415) 555-0132{'\n'}
              Email:{' '}
              <Text
                style={styles.emailLink}
                onPress={() => Linking.openURL('mailto:ananddev@gmail.com')}
              >
                ananddev@gmail.com
              </Text>
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Careers at CareConnect</Text>
            <Text style={styles.infoText}>
              Learn more about our teams and current job openings.
            </Text>

            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => Linking.openURL('https://careconnect.com/jobs')}
            >
              <Text style={styles.exploreBtnText}>Explore Jobs</Text>
            </TouchableOpacity>
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
  contactImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 28,
  },
  infoContainer: {
    gap: 14,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 24,
  },
  emailLink: {
    color: '#374151',
    textDecorationLine: 'underline',
  },
  exploreBtn: {
    borderWidth: 1,
    borderColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});

export default ContactScreen;
