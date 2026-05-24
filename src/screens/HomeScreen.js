import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';

// Components
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';
import Footer from '../components/Footer';

const HomeScreen = ({ navigation }) => {
  const { getDoctors } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getDoctors();
    } finally {
      setRefreshing(false);
    }
  }, [getDoctors]);
  return (
    <SafeAreaView style={styles.main} edges={['top']}>
      <Navbar navigation={navigation} currentRoute="Home" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5f6FFF']}
            tintColor="#5f6FFF"
          />
        }
      >
        <Header navigation={navigation} />
        <SpecialityMenu navigation={navigation} />
        <TopDoctors navigation={navigation} />
        <Banner navigation={navigation} />
        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
});

export default HomeScreen;
