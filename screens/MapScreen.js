import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { getIncidents } from '../services/firestoreService';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      const data = await getIncidents();
      setIncidents(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color="#1976D2" /></View>;
  if (!location) return <View style={styles.center}><Text>No se pudo obtener la ubicación.</Text></View>;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {incidents.map((inc) => (
          <Marker
            key={inc.id}
            coordinate={{ latitude: inc.latitude, longitude: inc.longitude }}
            pinColor={inc.type === 'robo' ? '#E53935' : '#1976D2'}
          >
            <Callout>
              <Text>{inc.type} - {inc.category}</Text>
              <Text>{inc.date} {inc.time}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
}); 