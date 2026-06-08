import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContextProvider from './src/context/AppContext';
import { FavouritesProvider } from './src/context/FavouritesContext';

import HomeScreen          from './src/screens/HomeScreen';
import DoctorsScreen       from './src/screens/DoctorsScreen';
import LoginScreen         from './src/screens/LoginScreen';
import AboutScreen         from './src/screens/AboutScreen';
import ContactScreen       from './src/screens/ContactScreen';
import MyProfileScreen     from './src/screens/MyProfileScreen';
import MyAppointmentsScreen from './src/screens/MyAppointmentsScreen';
import AppointmentScreen   from './src/screens/AppointmentScreen';
import SearchScreen        from './src/screens/SearchScreen';
import FavouritesScreen    from './src/screens/FavouritesScreen';
import SymptomCheckerScreen from './src/screens/SymptomCheckerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <FavouritesProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false }}   
            >
              <Stack.Screen name="Home"           component={HomeScreen} />
              <Stack.Screen name="Doctors"        component={DoctorsScreen} />
              <Stack.Screen name="Login"          component={LoginScreen} />
              <Stack.Screen name="About"          component={AboutScreen} />
              <Stack.Screen name="Contact"        component={ContactScreen} />
              <Stack.Screen name="MyProfile"      component={MyProfileScreen} />
              <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
              <Stack.Screen name="Appointment"    component={AppointmentScreen} />
              <Stack.Screen name="Search"         component={SearchScreen} />
              <Stack.Screen name="Favourites"     component={FavouritesScreen} />
              <Stack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavouritesProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
}
