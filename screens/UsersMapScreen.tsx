import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors } from '../theme';

// const { width, height } = Dimensions.get('window');

export default function UsersMapScreen() {
  // Ejemplo de usuarios conectados (simulado)
  const users = [
    { id: '1', name: 'Usuario 1', latitude: -0.22985, longitude: -78.52495 },
    { id: '2', name: 'Usuario 2', latitude: -0.22990, longitude: -78.52500 },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: users[0].latitude,
          longitude: users[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
});
