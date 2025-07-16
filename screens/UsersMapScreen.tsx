import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors } from '../theme';
import MapView, {PROVIDER_GOOGLE}from 'react-native-maps';

export default function UsersMapScreen() {
  // Datos de usuarios simulados
  const users = [
    { id: '1', name: 'Usuario 1', coordinates: { latitude: -0.22985, longitude: -78.52495 } },
    { id: '2', name: 'Usuario 2', coordinates: { latitude: -0.22990, longitude: -78.52500 } },
    { id: '3', name: 'Usuario 3', coordinates: { latitude: -0.22995, longitude: -78.52505 } },
  ];

  const markers = users.map(user => ({
    id: user.id,
    coordinates: user.coordinates,
    title: user.name,
    snippet: 'Usuario conectado'
  }));

  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <Header />
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}  
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Los mapas no están disponibles en esta plataforma</Text>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  map: {
    flex: 1
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center'
  }
});
