import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function SurveillanceScreen() {
  const [location, setLocation] = useState(null);
  const [watching, setWatching] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let interval;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      setWatching(true);
      interval = setInterval(async () => {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }, 5000);
    })();
    return () => interval && clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vigilancia en tiempo real</Text>
      <Video
        ref={videoRef}
        source={require('../assets/robo-demo.mp4')}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={!videoPaused}
        isLooping
        useNativeControls
      />
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => setVideoPaused(!videoPaused)}>
          <Text style={styles.buttonText}>{videoPaused ? 'Reanudar' : 'Pausar'} video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRed} onPress={() => alert('¡Alerta reportada!')}>
          <Text style={styles.buttonText}>Reportar alerta</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Ubicación en tiempo real:</Text>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        </MapView>
      ) : (
        <ActivityIndicator color="#E53935" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#E53935', marginBottom: 8, textAlign: 'center' },
  video: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#000', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  button: { backgroundColor: '#1976D2', padding: 12, borderRadius: 10, flex: 1, marginRight: 4 },
  buttonRed: { backgroundColor: '#E53935', padding: 12, borderRadius: 10, flex: 1, marginLeft: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#333', marginVertical: 8, textAlign: 'center' },
  map: { width: '100%', height: 180, borderRadius: 12 },
}); 