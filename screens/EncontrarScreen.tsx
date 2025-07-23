import React from 'react';
import { View, StyleSheet } from 'react-native';
import Footer from '../components/Footer';
import { colors, FontFamily, FontSize } from '../theme';
import LogoFace from '../assets/svg/LogoFace';
import MapView, { Circle, Marker } from 'react-native-maps';
import Header from '../components/Header';

export default function EncontrarScreen() {
  // Datos de usuarios simulados
  const users = [
    { id: '1', name: 'Usuario 1' },
    { id: '2', name: 'Usuario 2' },
    { id: '3', name: 'Usuario 3' },
    { id: '4', name: 'Usuario 4' },
    { id: '5', name: 'Usuario 5' },
  ];

  const InitialLocation = { latitude: -0.1990152, longitude: -78.5038685 };
  // Algoritmo para distribuir los usuarios dentro del círculo
  function getUserCoordinates(center: { latitude: number; longitude: number }, radius: number, count: number): { latitude: number; longitude: number }[] {
    // radius in meters, convert to degrees (approx)
    const earthRadius = 6378137;
    const radToDeg = 180 / Math.PI;
    const degRadius = (radius / earthRadius) * radToDeg;
    const coords = [];
    for (let i = 0; i < count; i++) {
      // Espaciado angular
      const angle = (2 * Math.PI * i) / count + Math.PI / 6;
      // Distancia radial (no todos en el borde)
      const r = degRadius * (0.5 + 0.4 * Math.random());
      const lat = center.latitude + r * Math.cos(angle);
      const lng = center.longitude + r * Math.sin(angle);
      coords.push({ latitude: lat, longitude: lng });
    }
    return coords;
  }


  const userCoords = getUserCoordinates(InitialLocation, 400, users.length);
  const mapRegion = {
    latitude: InitialLocation.latitude,
    longitude: InitialLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };



  return (
    <View style={styles.container}>
      <Header />
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        <Marker
          coordinate={InitialLocation}
          title="Kuntur Dron"
          description="Ubicación actual del dron de seguridad"
        >
          <View style={styles.markerContainer}>
            <LogoFace color={colors.primary_2[500]} width={30} height={30} />
          </View>
        </Marker>

        {/* Render user markers spaced out within the circle */}
        {users.map((user, idx) => (
          <Marker
            key={user.id}
            coordinate={userCoords[idx]}
            title={user.name}
            description={"Usuario conectado"}
          >
            <View style={[styles.markerContainer, { backgroundColor: colors.primary_2[100], borderColor: colors.primary_2[500] }]}>
              <LogoFace color={colors.primary_2[500]} width={22} height={22} />
            </View>
          </Marker>
        ))}

        <Circle
          center={InitialLocation}
          radius={500}
          strokeColor={colors.primary_2[500]}
          strokeWidth={2}
        />
      </MapView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutro,
    borderRadius: 25,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: colors.primary_2[500],
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.neutro,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[200],
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    color: colors.dark[700],
    fontWeight: 'bold',
  },
  toggleText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    color: colors.dark[500],
  },
  infoContent: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: colors.dark[600],
  },
  infoValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: colors.dark[800],
    fontWeight: 'bold',
  }
});
