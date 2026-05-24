import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const TopDoctors = ({ navigation }) => {
  const { doctors } = useContext(AppContext);

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
            onPress={() => navigation.navigate('Appointment', { docId: item._id })}
          >
            <View style={styles.imageContainer}>
               <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.statusContainer}>
                <View style={[styles.dot, { backgroundColor: item.available ? '#10B981' : '#6B7280' }]} />
                <Text style={[styles.statusText, { color: item.available ? '#10B981' : '#6B7280' }]}>
                  {item.available ? 'Available' : 'Not Available'}
                </Text>
              </View>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.speciality}>{item.speciality}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => navigation.navigate('Doctors')}
      >
        <Text style={styles.moreButtonText}>more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827', // text-gray-900
    marginBottom: 5,
  },
  desc: {
    fontSize: 13,
    color: '#6B7280', // text-gray-500
    textAlign: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%', // two columns on mobile
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#BFDBFE', // border-blue-200
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: '#EFF6FF', // bg-blue-50
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  speciality: {
    fontSize: 12,
    color: '#4B5563',
  },
  moreButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  moreButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default TopDoctors;
