import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const MyAppointmentsScreen = ({ navigation }) => {
  const { backendUrl, token, getDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserAppointments();
    setRefreshing(false);
  }, [token]);

  useEffect(() => {
    if (token) {
      getUserAppointments();
    } else {
      navigation.replace("Login");
    }
  }, [token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });
      if (data.success) {
        Alert.alert("Success", data.message);
        getUserAppointments();
        getDoctors();
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Image 
          source={{ uri: item.docData?.image }} 
          style={styles.docImage} 
        />
        <View style={styles.docInfo}>
          <Text style={styles.docName}>{item.docData?.name}</Text>
          <Text style={styles.docSpeciality}>{item.docData?.speciality}</Text>
          
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.addressText}>{item.docData?.address?.line1}</Text>
          {item.docData?.address?.line2 ? <Text style={styles.addressText}>{item.docData?.address?.line2}</Text> : null}
          
          <Text style={styles.dateTime}>
            <Text style={styles.dateTimeLabel}>Date & Time:</Text> {slotDateFormat(item.slotDate)} | {item.slotTime}
          </Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        {!item.cancelled && !item.isCompleted && (
          <View style={styles.statusBtnConfirmed}>
            <Text style={styles.statusBtnConfirmedText}>Confirmed</Text>
          </View>
        )}
        {item.isCompleted && (
          <View style={styles.statusBtnCompleted}>
            <Text style={styles.statusBtnCompletedText}>Completed ✓</Text>
          </View>
        )}
        {item.cancelled && (
          <View style={styles.statusBtnCancelled}>
            <Text style={styles.statusBtnCancelledText}>Appointment Cancelled</Text>
          </View>
        )}
        {!item.cancelled && !item.isCompleted && (
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => cancelAppointment(item._id)}
          >
            <Text style={styles.cancelBtnText}>Cancel appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5f6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <Navbar navigation={navigation} />
      <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No appointments booked yet</Text>
          <Text style={styles.emptyDesc}>Book an appointment with one of our doctors</Text>
          <TouchableOpacity style={styles.findBtn} onPress={() => navigation.navigate("Doctors")}>
            <Text style={styles.findBtnText}>Find Doctors</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#5f6FFF']}
              tintColor="#5f6FFF"
            />
          }
        />
      )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '500', color: '#3F3F46', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 16 },
  card: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  cardTop: { flexDirection: 'row', gap: 16 },
  docImage: { width: 90, height: 110, backgroundColor: '#EEF2FF', borderRadius: 8 },
  docInfo: { flex: 1 },
  docName: { fontSize: 16, fontWeight: '600', color: '#3F3F46' },
  docSpeciality: { fontSize: 13, color: '#52525B', marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '500', color: '#3F3F46', marginTop: 4 },
  addressText: { fontSize: 12, color: '#71717A' },
  dateTime: { fontSize: 13, color: '#52525B', marginTop: 8 },
  dateTimeLabel: { fontSize: 14, fontWeight: '500', color: '#3F3F46' },
  btnContainer: { flexDirection: 'column', gap: 8, marginTop: 16 },
  statusBtnConfirmed: { paddingVertical: 8, borderWidth: 1, borderColor: '#BBF7D0', backgroundColor: '#F0FDF4', borderRadius: 20, alignItems: 'center' },
  statusBtnConfirmedText: { color: '#15803D', fontSize: 13 },
  statusBtnCompleted: { paddingVertical: 8, borderWidth: 1, borderColor: '#22C55E', borderRadius: 20, alignItems: 'center' },
  statusBtnCompletedText: { color: '#22C55E', fontSize: 13 },
  statusBtnCancelled: { paddingVertical: 8, borderWidth: 1, borderColor: '#EF4444', borderRadius: 20, alignItems: 'center' },
  statusBtnCancelledText: { color: '#EF4444', fontSize: 13 },
  cancelBtn: { paddingVertical: 8, borderWidth: 1, borderColor: '#D4D4D8', borderRadius: 20, alignItems: 'center' },
  cancelBtnText: { color: '#52525B', fontSize: 13 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 50 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#71717A' },
  emptyDesc: { fontSize: 13, color: '#A1A1AA', marginTop: 4, marginBottom: 20 },
  findBtn: { backgroundColor: '#5f6FFF', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  findBtnText: { color: '#fff', fontSize: 14 }
});

export default MyAppointmentsScreen;
