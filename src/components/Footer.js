import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LogoText = () => (
  <Text style={styles.logoText}>
    <Text style={styles.logoCare}>Care</Text>
    <Text style={styles.logoConnect}>Connect</Text>
  </Text>
);

const Footer = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Left - Logo + Description */}
        <View style={styles.leftCol}>
          <LogoText />
          <Text style={styles.description}>
            CareConnect is your trusted partner in managing your healthcare needs conveniently and efficiently. We bridge the gap between patients and top healthcare professionals.
          </Text>
        </View>

        {/* Middle & Right side links */}
        <View style={styles.linksRow}>
          <View style={styles.linkCol}>
            <Text style={styles.linkHeading}>COMPANY</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Home')}>
              <Text style={styles.linkItem}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation?.navigate('About')}>
              <Text style={styles.linkItem}>About us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation?.navigate('Contact')}>
              <Text style={styles.linkItem}>Contact us</Text>
            </TouchableOpacity>
            <Text style={styles.linkItem}>Privacy policy</Text>
          </View>

          <View style={styles.linkCol}>
            <Text style={styles.linkHeading}>GET IN TOUCH</Text>
            <Text style={styles.linkItem}>+1-212-832-7382</Text>
            <Text style={styles.linkItem}>ananddev@gmail.com</Text>
          </View>
        </View>
      </View>

      {/* Divider + Copyright */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />
        <Text style={styles.copyright}>
          Copyright © 2025 Anand - All Right Reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  logoCare: {
    color: '#5f6FFF',
  },
  logoConnect: {
    color: '#1F2937',
  },
  topSection: {
    gap: 28,
  },
  leftCol: {
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 22,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 30,
  },
  linkCol: {
    flex: 1,
    gap: 8,
  },
  linkHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  linkItem: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 22,
  },
  bottomSection: {
    marginTop: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  copyright: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    paddingBottom: 24,
  },
});

export default Footer;
