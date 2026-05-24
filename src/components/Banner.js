import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Banner = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>
      <Text style={styles.subtitle}>With 100+ Trusted Doctors</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5f6FFF', // primary
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 40,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center', // Center aligned for mobile view as per web's sm logic behavior (mostly stack)
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 24,
  },
  buttonText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '500',
  }
});

export default Banner;
